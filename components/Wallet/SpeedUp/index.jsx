import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { FilecoinNumber, BigNumber } from '@glif/filecoin-number'
import { validateAddressString } from '@glif/filecoin-address'
import { Message } from '@glif/filecoin-message'

import {
  Box,
  Input,
  Num,
  Button,
  ButtonClose,
  StepHeader,
  Title,
  Form,
  Card
} from '../../Shared'
import { CardHeader } from '../../Msig/Shared'
import ConfirmationCard from './ConfirmationCard'
import HeaderText from './HeaderText'
import ErrorCard from './ErrorCard'
import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { LEDGER, SEND, emptyGasInfo } from '../../../constants'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import reportError from '../../../utils/reportError'
import isBase64 from '../../../utils/isBase64'
import { confirmMessage } from '../../../store/actions'

const TOTAL_STEPS = 2

const isValidForm = (
  otherError,
  paramsError
) => {
  return !otherError && !paramsError
}

const SpeedUp = ({ close }) => {
  const dispatch = useDispatch()
  const wallet = useWallet()
  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState
  } = useWalletProvider()
  const [toAddress, setToAddress] = useState('')
  const [params, setParams] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [paramsError, setParamsError] = useState('')
  const [value, setValue] = useState(new FilecoinNumber('0', 'fil'))
  const [valueError, setValueError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [gasError, setGasError] = useState('')
  const [gasInfo, setGasInfo] = useState(emptyGasInfo)

  const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [mPoolPushing, setMPoolPushing] = useState(false)

  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)

  // todo: update
  const send = async () => {
    setFetchingTxDetails(true)
    let provider = walletProvider
    // attempt to establish a new connection with the ledger device if the user selected ledger
    if (wallet.type === LEDGER) {
      provider = await connectLedger()
    }

    if (provider) {

      const nonce = await provider.getNonce(wallet.address)
      const message = new Message({
        to: toAddress,
        from: wallet.address,
        value: value.toAttoFil(),
        method: 0,
        gasFeeCap: gasInfo.gasFeeCap.toAttoFil(),
        gasLimit: new BigNumber(gasInfo.gasLimit.toAttoFil()).toNumber(),
        gasPremium: gasInfo.gasPremium.toAttoFil(),
        nonce,
        params
      })

      setFetchingTxDetails(false)
      const signedMessage = await provider.wallet.sign(
        message.toSerializeableType(),
        wallet.path
      )

      const messageObj = message.toLotusType()
      setMPoolPushing(true)
      const validMsg = await provider.simulateMessage(message.toLotusType())
      if (validMsg) {
        const msgCid = await provider.sendMessage(
          message.toLotusType(),
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
        messageObj.method = SEND
        messageObj.params = params || {}
        return messageObj
      }
      throw new Error('Filecoin message invalid. No gas or fees were spent.')
    }
  }

  // todo: update
  const sendMsg = async () => {
    try {
      const message = await send()
      if (message) {
        dispatch(confirmMessage(toLowerCaseMsgFields(message)))
        setValue(new FilecoinNumber('0', 'fil'))
        close()
      }
    } catch (err) {
      if (err.message.includes('Unexpected number of items')) {
        setUncaughtError(
          'Ledger devices cannot sign arbitrary base64 params yet. Coming soon.'
        )
      } else {
        reportError(9, false, err.message, err.stack)
        setUncaughtError(err.message)
      }

      // TODO: Fix step for error
      setStep(4)
    } finally {
      setAttemptingTx(false)
      setFetchingTxDetails(false)
      setMPoolPushing(false)
    }
  }

  const populateErrors = () => {
    if (!isValidAddress(toAddress, toAddressError))
      setToAddressError('Invalid address.')
    if (!isValidAmount(value, wallet.balance, valueError))
      setValueError(
        'Please enter a valid amount that is less than your Filecoin balance.'
      )
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (step === 1 && validateAddressString(toAddress)) {
      setStep(2)
    } else if (step === 2 && !valueError) {
      setStep(3)
    }
    //  else set error
  }

  const hasError = () =>
    !!(
      uncaughtError ||
      (wallet.type === LEDGER && reportLedgerConfigError(ledger))
    )

  const ledgerError = () =>
    wallet.type === LEDGER && reportLedgerConfigError(ledger)

  const submitBtnText = () => {
    // if (step === 6 && wallet.type !== LEDGER) return 'Send'
    // if (step === 6 && wallet.type === LEDGER) return 'Confirm on device.'
    if (step < 2) return 'Next'

    return 'Send'
  }

  return (
    <>
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
            setParamsError('')
            resetLedgerState()
            close()
          }}
        />
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
              {hasError() && (
                <ErrorCard
                  error={ledgerError() || uncaughtError}
                  reset={() => {
                    // TODO confirm that these resets are still all correct.
                    setAttemptingTx(false)
                    setUncaughtError('')
                    setGasError('')
                    setParamsError('')
                    resetLedgerState()
                    setStep(step - 1)
                  }}
                />
              )}
              {!hasError() && attemptingTx && (
                <ConfirmationCard
                  walletType={wallet.type}
                  currentStep={TOTAL_STEPS}
                  totalSteps={TOTAL_STEPS}
                  loading={fetchingTxDetails || mPoolPushing}
                />
              )}
            {/* todo update */}
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
                      title='Speed Up Transaction'
                      currentStep={step}
                      totalSteps={TOTAL_STEPS}
                      glyphAcronym='Su'
                    />
                    <Box mt={6} mb={4}>
                      <HeaderText step={step} walletType={wallet.type} />
                    </Box>
                  </Card>
                </>
              )}
              <Box boxShadow={2} borderRadius={4}>
                {/* TODO do we need to pass a prop to change Ms to Su here? */}
                <CardHeader
                  address={wallet.address}
                  signerBalance={wallet.balance}
                />

                <Box width='100%' p={3} border={0} bg='background.screen'>
                  <Input.Address
                    label='Recipient'
                    value={toAddress}
                    onChange={e => setToAddress(e.target.value)}
                    error={toAddressError}
                    disabled={step > 1}
                    placeholder='f1...'
                    onFocus={() => {
                      if (toAddressError) setToAddressError('')
                    }}
                  />
                </Box>
                <Box>
                  {step > 1 && (
                    <Box
                      width='100%'
                      px={3}
                      pb={step === 2 && 3}
                      border={0}
                      bg='background.screen'
                    >
                      <Input.Funds
                        name='amount'
                        label='Amount'
                        amount={value.toAttoFil()}
                        onAmountChange={setValue}
                        balance={wallet.balance}
                        error={valueError}
                        setError={setValueError}
                        disabled={step > 2 && !hasError()}
                      />
                    </Box>
                  )}
                    {/* UPDATE */}
                  {step > 2 && (
                    <Box width='100%' p={3} border={0} bg='background.screen'>
                      <Input.Text
                        label='Params'
                        value={params}
                        onChange={e => setParams(e.target.value)}
                        error={paramsError}
                        disabled={step > 3}
                        placeholder='Optional base64 params'
                        onFocus={() => {
                          if (paramsError) setParamsError('')
                        }}
                      />
                    </Box>
                  )}
                  </Box>
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
                  setParamsError('')
                  resetLedgerState()
                  if (step === 1) {
                    close()
                  } else {
                    setStep(step - 1)
                  }
                }}
                disabled={
                  // todo: refer to send.js for example
                  false
                }
              />
              <Button
                variant='primary'
                title={submitBtnText()}
                disabled={
                  // todo: refer to send.js for example
                  false
                }
                type='submit'
              />
            </Box>
          </Box>
        </Form>
      </Box>
    </>
  )
}

SpeedUp.propTypes = {
  close: PropTypes.func.isRequired
}

export default SpeedUp
