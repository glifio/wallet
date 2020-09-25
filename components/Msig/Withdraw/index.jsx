import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { Message } from '@openworklabs/filecoin-message'
import { validateAddressString } from '@openworklabs/filecoin-address'

import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import {
  Box,
  Button,
  ButtonClose,
  StepHeader,
  Input,
  Text,
  IconLedger,
  Num,
  Title,
  Form
} from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import { CardHeader, WithdrawHeaderText } from '../Shared'
import { useWasm } from '../../../lib/WasmLoader'
import ErrorCard from '../../Wallet/Send.js/ErrorCard'
import ConfirmationCard from '../../Wallet/Send.js/ConfirmationCard'
import { LEDGER, PROPOSE } from '../../../constants'
import {
  reportLedgerConfigError,
  hasLedgerError
} from '../../../utils/ledger/reportLedgerConfigError'
import reportError from '../../../utils/reportError'
import { confirmMessage } from '../../../store/actions'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'

const isValidAmount = (value, balance, errorFromForms) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThan(value)
  return valueFieldFilledOut && enoughInTheBank && !errorFromForms
}

const Withdrawing = ({ address, balance, close }) => {
  const { ledger, connectLedger, resetLedgerState } = useWalletProvider()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const { serializeParams } = useWasm()

  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [value, setValue] = useState(new FilecoinNumber('0', 'fil'))
  const [valueError, setValueError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [estimatedTransactionFee, setEstimatedTransactionFee] = useState(
    new FilecoinNumber('122222', 'attofil')
  )
  const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
  const [mPoolPushing, setMPoolPushing] = useState(false)

  const sendMsg = async () => {
    setFetchingTxDetails(true)
    const provider = await connectLedger()

    if (provider) {
      const nonce = await provider.getNonce(wallet.address)
      const params = {
        to: toAddress,
        value: value.toAttoFil(),
        method: 0,
        params: ''
      }

      const serializedParams = Buffer.from(serializeParams(params), 'hex')
      const message = new Message({
        to: address,
        from: wallet.address,
        value: '0',
        method: 2,
        nonce,
        params: serializedParams.toString('base64')
      })

      const msgWithGas = await provider.gasEstimateMessageGas(
        message.toLotusType()
      )

      setFetchingTxDetails(false)

      const signedMessage = await provider.wallet.sign(
        msgWithGas.toSerializeableType(),
        wallet.path
      )

      const messageObj = msgWithGas.toLotusType()
      setMPoolPushing(true)
      const msgCid = await provider.sendMessage(messageObj, signedMessage)
      messageObj.cid = msgCid['/']
      messageObj.timestamp = dayjs().unix()
      const maxFee = await provider.gasEstimateMaxFee(msgWithGas.toLotusType())
      messageObj.maxFee = maxFee.toAttoFil()
      // dont know how much was actually paid in this message yet, so we mark it as 0
      messageObj.paidFee = '0'
      messageObj.value = new FilecoinNumber(messageObj.Value, 'attofil').toFil()
      // reformat the params and method for tx table
      messageObj.params = {
        to: toAddress,
        value: value.toAttoFil(),
        method: 0,
        params: ''
      }
      messageObj.method = PROPOSE
      return messageObj
    }
    return null
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (step === 1 && validateAddressString(toAddress)) {
      setStep(2)
    } else if (step === 1 && !validateAddressString(toAddress)) {
      setToAddressError('Invalid to address')
    } else if (step === 2 && !valueError) {
      setStep(3)
    } else if (step === 3) {
      setAttemptingTx(true)
      try {
        const msg = await sendMsg()
        setAttemptingTx(false)
        if (msg) {
          dispatch(confirmMessage(toLowerCaseMsgFields(msg)))
          setValue(new FilecoinNumber('0', 'fil'))
          close()
        }
      } catch (err) {
        if (err.message.includes('19')) {
          setUncaughtError('Insufficient Multisig wallet available balance.')
        } else if (err.message.includes('2')) {
          setUncaughtError(
            `${wallet.address} has insufficient funds to pay for the transaction.`
          )
        } else if (err.message.includes('18')) {
          setUncaughtError(
            `${wallet.address} is not a signer of the multisig wallet ${address}.`
          )
        } else {
          reportError(20, false, err, err.message, err.stack)
          setUncaughtError(err.message || err)
        }
        setStep(2)
      } finally {
        setFetchingTxDetails(false)
        setAttemptingTx(false)
        setMPoolPushing(false)
      }
    }
  }

  const isSubmitBtnDisabled = () => {
    if (uncaughtError) return false
    if (attemptingTx) return true
    if (step === 1 && !toAddress) return true
    if (step === 2 && !isValidAmount(value, balance, valueError)) return true
  }

  return (
    <>
      <ButtonClose
        role='button'
        type='button'
        position='fixed'
        top='3'
        right='3'
        onClick={() => {
          setAttemptingTx(false)
          setUncaughtError('')
          resetLedgerState()
          close()
        }}
      />
      <Form onSubmit={onSubmit}>
        <Box
          maxWidth={14}
          width={13}
          minWidth={12}
          display='flex'
          flex='1'
          flexDirection='column'
          justifyContent='space-between'
        >
          <Box>
            {hasLedgerError({ ...ledger, otherError: uncaughtError }) && (
              <ErrorCard
                error={reportLedgerConfigError({
                  ...ledger,
                  otherError: uncaughtError
                })}
                reset={() => {
                  setAttemptingTx(false)
                  setUncaughtError('')
                  resetLedgerState()
                  setStep(2)
                }}
              />
            )}
            {attemptingTx && (
              <ConfirmationCard
                loading={fetchingTxDetails || mPoolPushing}
                walletType={LEDGER}
                currentStep={4}
                totalSteps={4}
              />
            )}
            {!attemptingTx &&
              !hasLedgerError({ ...ledger, otherError: uncaughtError }) && (
                <>
                  <StepHeader
                    title='Withdrawing Filecoin'
                    currentStep={step}
                    totalSteps={4}
                    glyphAcronym='Wd'
                  />
                  <WithdrawHeaderText step={step} customizingGas={false} />
                </>
              )}
            <Box boxShadow={2} borderRadius={4}>
              <CardHeader
                address={address}
                balance={balance}
                customizingGas={false}
              />
              <Box width='100%' p={3} border={0} bg='background.screen'>
                <Input.Address
                  label='Recipient'
                  value={toAddress}
                  onChange={e => setToAddress(e.target.value)}
                  error={toAddressError}
                  disabled={step === 3}
                  onFocus={() => {
                    if (toAddressError) setToAddressError('')
                  }}
                />
              </Box>
              {step > 1 && (
                <Box width='100%' p={3} border={0} bg='background.screen'>
                  <Input.Funds
                    name='amount'
                    label='Amount'
                    amount={value.toAttoFil()}
                    onAmountChange={setValue}
                    balance={balance}
                    error={valueError}
                    setError={setValueError}
                    // since the ledger device pays the gas fee, we dont include that in the funds input
                    estimatedTransactionFee={new FilecoinNumber('0', 'attofil')}
                    disabled={step === 3}
                  />
                </Box>
              )}
              {step > 2 && (
                <>
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-between'
                    width='100%'
                    p={3}
                    border={0}
                    bg='background.screen'
                  >
                    <Text margin={0}>Transaction Fee</Text>
                    <Box display='flex' alignItems='center'>
                      <Text margin={0} color='core.darkgray'>
                        Paid via
                      </Text>
                      <IconLedger height='32px' />{' '}
                      <Text margin={0} color='core.darkgray'>
                        {makeFriendlyBalance(wallet.balance, 2, true)} FIL
                      </Text>
                    </Box>
                    <Text ml={2} color='core.primary'>
                      {'< 0.0001 FIL'}
                    </Text>
                  </Box>
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='flex-start'
                    justifyContent='space-between'
                    pt={6}
                    pb={3}
                    px={3}
                    bg='background.screen'
                    borderBottomLeftRadius={3}
                    borderBottomRightRadius={3}
                  >
                    <Title fontSize={4} alignSelf='flex-start'>
                      Total
                    </Title>
                    <Box
                      display='flex'
                      flexDirection='column'
                      textAlign='right'
                      pl={4}
                    >
                      <Num
                        size='l'
                        css={`
                          word-wrap: break-word;
                        `}
                        color='core.primary'
                      >
                        {value.toFil()} FIL
                      </Num>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          <Box
            display='flex'
            flex='1'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='flex-end'
            margin='auto'
            maxWidth={14}
            width={13}
            minWidth={12}
          >
            <Button
              title='Back'
              variant='secondary'
              onClick={() => {
                setAttemptingTx(false)
                setUncaughtError('')
                resetLedgerState()
                if (step === 1) {
                  close()
                } else {
                  setStep(step - 1)
                }
              }}
              disabled={attemptingTx}
            />
            <Button
              variant='primary'
              title='Next'
              disabled={isSubmitBtnDisabled()}
              type='submit'
            />
          </Box>
        </Box>
      </Form>
    </>
  )
}

Withdrawing.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP,
  close: PropTypes.func.isRequired
}

export default Withdrawing
