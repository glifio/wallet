import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { FilecoinNumber } from '@glif/filecoin-number'
import { useRouter } from 'next/router'
import { Message } from '@glif/filecoin-message'
import { LoadingScreen, StyledATag, Text } from '@glif/react-components'

import useReplacedMessageWithSpeed from '../../../lib/useReplacedMessageWithSpeed.tsx'

// todo: temp remove
import ErrorCard from '../Send/ErrorCard'
import ConfirmationCard from './ConfirmationCard'
import {
  Box,
  Input,
  Button,
  ButtonClose,
  StepHeader,
  Form,
  Card,
  PageWrapper
} from '../../Shared'
import { CardHeader } from '../../Msig/Shared'
import HeaderText from './HeaderText'
import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { LEDGER, emptyGasInfo } from '../../../constants'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import reportError from '../../../utils/reportError'
import { confirmMessage } from '../../../store/actions'

const TOTAL_STEPS = 2

const isValidForm = (otherError, paramsError) => {
  return !otherError && !paramsError
}

const Replace = ({ close, messageCid }) => {
  const dispatch = useDispatch()
  const wallet = useWallet()

  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState
  } = useWalletProvider()

  const {
    messageWithSpeed,
    loading,
    error,
    originalMessage,
    maxFee
  } = useReplacedMessageWithSpeed(messageCid, wallet.address, walletProvider)

  const message = messageWithSpeed?.toSerializeableType() || {}
  const [gasInfo, setGasInfo] = useState(emptyGasInfo)
  const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [mPoolPushing, setMPoolPushing] = useState(false)
  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [expertMode, setExpertMode] = useState(false)

  const [uncaughtError, setUncaughtError] = useState('')
  const [gasError, setGasError] = useState('')

  const send = async () => {
    setFetchingTxDetails(true)
    let provider = walletProvider
    // attempt to establish a new connection with the ledger device if the user selected ledger
    if (wallet && wallet.type === LEDGER) {
      provider = await connectLedger()
    }

    if (provider) {
      const msgToSend = new Message({
        to: message.to,
        from: message.from,
        method: message.method,
        value: message.value,
        gasFeeCap: message.gasfeecap,
        gasLimit: message.gaslimit,
        gasPremium: message.gaspremium,
        nonce: message.nonce,
        params: message.params
      })

      setFetchingTxDetails(false)
      const signedMessage = await provider.wallet.sign(
        msgToSend.toSerializeableType(),
        wallet.path
      )

      const messageObj = msgToSend.toLotusType()
      setMPoolPushing(true)
      const validMsg = await provider.simulateMessage(msgToSend.toLotusType())
      if (validMsg) {
        const msgCid = await provider.sendMessage(
          msgToSend.toLotusType(),
          signedMessage
        )

        messageObj.cid = msgCid['/']
        messageObj.timestamp = dayjs().unix()
        messageObj.maxFee = gasInfo.estimatedTransactionFee.toAttoFil()
        // dont know how much was actually paid in this message yet, so we mark it as 0
        messageObj.paidFee = '0'
        messageObj.value = new FilecoinNumber(
          messageObj.Value,
          'attofil'
        ).toAttoFil()
        messageObj.method = originalMessage.method
        messageObj.params = originalMessage.params || {}
        return messageObj
      }
      throw new Error('Filecoin message invalid. No gas or fees were spent.')
    }
  }

  const sendMsg = async () => {
    try {
      const message = await send()
      if (message) {
        dispatch(confirmMessage(toLowerCaseMsgFields(message)))
        close()
      }
    } catch (err) {
      if (err.message && err.message.includes('Unexpected number of items')) {
        setUncaughtError(
          'Ledger devices cannot sign arbitrary base64 params yet. Coming soon.'
        )
      } else {
        reportError(9, false, err.message, err.stack)
        setUncaughtError(err.message)
      }

      setStep(2)
    } finally {
      setAttemptingTx(false)
      setFetchingTxDetails(false)
      setMPoolPushing(false)
    }
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (step === 1) {
      setAttemptingTx(true)
      setStep(2)
    } else if (step === 2) {
      await sendMsg()
    }
  }

  const hasError = () =>
    !!(
      uncaughtError ||
      (wallet.type === LEDGER && reportLedgerConfigError(ledger))
    )

  const ledgerError = () =>
    wallet.type === LEDGER && reportLedgerConfigError(ledger)

  const submitBtnText = () => {
    if (step === 1) return 'Next'
    else if (step === 2) return 'Send'

    return 'Send'
  }

  return (
    <PageWrapper>
      <Box display='flex' flexDirection='column' width='100%'>
        <ButtonClose
          role='button'
          type='button'
          justifySelf='flex-end'
          marginLeft='auto'
          onClick={() => {
            // TODO confirm that these resets are still all correct.
            setAttemptingTx(false)
            setUncaughtError('')
            setGasError('')
            resetLedgerState()
            close()
          }}
        />
        {loading && <LoadingScreen height='100vh' />}
        {!loading && (
          <Form onSubmit={onSubmit}>
            <Box
              maxWidth={13}
              width='100%'
              minWidth={11}
              display='flex'
              flex='1'
              flexDirection='column'
              justifyContent='flex-start'
            >
              <Box>
                {/* todo update */}
                {hasError() && (
                  <ErrorCard
                    error={ledgerError() || uncaughtError}
                    reset={() => {
                      setAttemptingTx(false)
                      setUncaughtError('')
                      setGasError('')
                      resetLedgerState()
                      setStep(step - 1)
                    }}
                  />
                )}
                {!hasError() && attemptingTx && (
                  <ConfirmationCard
                    walletType={wallet.type}
                    currentStep={step}
                    totalSteps={TOTAL_STEPS}
                    loading={fetchingTxDetails || mPoolPushing}
                    replaceStrategy='SPEED_UP'
                  />
                )}
                {!hasError() && !attemptingTx && (
                  <>
                    <Card
                      display='flex'
                      flexDirection='column'
                      justifyContent='space-between'
                      border='none'
                      width='auto'
                      my={2}
                      backgroundColor='blue.muted700'
                    >
                      <StepHeader
                        title='Speed Up Message'
                        currentStep={step}
                        totalSteps={TOTAL_STEPS}
                        glyphAcronym='Su'
                      />
                      <Box mt={6} mb={4}>
                        <HeaderText
                          step={step}
                          walletType={wallet.type}
                          expertMode={expertMode}
                        />
                      </Box>
                    </Card>
                  </>
                )}
                <Box boxShadow={2} borderRadius={4} bg='background.screen'>
                  <CardHeader
                    address={wallet.address}
                    signerBalance={wallet.balance}
                  />
                  {step >= 1 && (
                    <>
                      <Box width='100%' p={3} border={0}>
                        <Input.Text
                          my={3}
                          textAlign='right'
                          label='Message Cid'
                          value={messageCid}
                          disabled
                        />
                        <Input.Text
                          my={3}
                          textAlign='right'
                          label='Nonce'
                          value={message.nonce}
                          disabled
                        />
                        <Input.Text
                          my={3}
                          textAlign='right'
                          label='Gas Premium'
                          value={message.gaspremium}
                          disabled
                        />
                        <Input.Text
                          my={3}
                          textAlign='right'
                          label='Gas Limit'
                          value={message.gaslimit}
                          disabled
                        />
                        <Input.Text
                          my={3}
                          textAlign='right'
                          label='Fee Cap'
                          value={message.gasfeecap}
                          disabled
                        />
                        <Text width='100%' color='core.darkgray'>
                          You will not pay more than {maxFee.toFil()} FIL in
                          fees for this transaction.{' '}
                          <StyledATag
                            rel='noopener noreferrer'
                            target='_blank'
                            href='https://filfox.info/en/stats/gas'
                          >
                            More information on average gas fee statistics.
                          </StyledATag>
                        </Text>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
              <Box
                display='flex'
                flexGrow='1'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='flex-end'
                margin='auto'
                maxWidth={13}
                width='100%'
                minWidth={11}
                maxHeight={12}
                my={3}
              >
                <Button
                  title='Back'
                  variant='secondary'
                  onClick={() => {
                    setAttemptingTx(false)
                    setUncaughtError('')
                    setGasError('')
                    resetLedgerState()
                    if (step === 1) {
                      close()
                    } else {
                      setStep(step - 1)
                    }
                  }}
                />
                <Button
                  variant='primary'
                  title={submitBtnText()}
                  type='submit'
                />
              </Box>
            </Box>
          </Form>
        )}
      </Box>
    </PageWrapper>
  )
}

Replace.propTypes = {
  close: PropTypes.func.isRequired,
  messageCid: PropTypes.string.isRequired
}

export default Replace
