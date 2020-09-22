import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { validateAddressString } from '@openworklabs/filecoin-address'
import { Message } from '@openworklabs/filecoin-message'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

import {
  Box,
  Input,
  Text,
  Num,
  Button,
  ButtonClose,
  StepHeader,
  Title,
  Form
} from '../../Shared'
import { CardHeader } from '../../Msig/Shared'
import ConfirmationCard from './ConfirmationCard'
import HeaderText from './HeaderText'
import ErrorCard from './ErrorCard'
import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { LEDGER } from '../../../constants'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import { confirmMessage } from '../../../store/actions'
import { useConverter } from '../../../lib/Converter'
import reportError from '../../../utils/reportError'

// this is a bit confusing, sometimes the form can report errors, so we check those here too
const isValidAmount = (value, balance, errorFromForms) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThan(value)
  return valueFieldFilledOut && enoughInTheBank && !errorFromForms
}
const isValidAddress = (address, errorFromForms) => {
  const validToAddress = validateAddressString(address)
  return !errorFromForms && validToAddress
}

const isValidForm = (
  toAddress,
  value,
  balance,
  toAddressError,
  valueError,
  otherError
) => {
  const validToAddress = isValidAddress(toAddress, toAddressError)
  const validAmount = isValidAmount(value, balance, valueError)
  return validToAddress && validAmount && !otherError
}

const Send = ({ close }) => {
  const dispatch = useDispatch()
  const wallet = useWallet()
  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState
  } = useWalletProvider()
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

  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)

  const send = async () => {
    setFetchingTxDetails(true)
    let provider = walletProvider
    // attempt to establish a new connection with the ledger device if the user selected ledger
    if (wallet.type === LEDGER) {
      provider = await connectLedger()
      console.log('connected to ledger wallet provider?', provider)
    }

    if (provider) {
      const nonce = await provider.getNonce(wallet.address)
      const message = new Message({
        to: toAddress,
        from: wallet.address,
        value: value.toAttoFil(),
        method: 0,
        nonce,
        params: ''
      })

      const msgWithGas = await provider.gasEstimateMessageGas(
        message.toLotusType()
      )

      console.log('msg with gas', msgWithGas)

      setFetchingTxDetails(false)
      const signedMessage = await provider.wallet.sign(
        msgWithGas.toSerializeableType(),
        wallet.path
      )

      console.log(signedMessage, 'signedMessage')

      const messageObj = msgWithGas.toLotusType()
      setMPoolPushing(true)
      const msgCid = await provider.sendMessage(
        msgWithGas.toLotusType(),
        signedMessage
      )

      console.log(msgCid, 'msgCId')
      messageObj.cid = msgCid['/']
      messageObj.timestamp = dayjs().unix()
      const maxFee = await provider.gasEstimateMaxFee(msgWithGas.toLotusType())
      messageObj.maxFee = maxFee.toAttoFil()
      // dont know how much was actually paid in this message yet, so we mark it as 0
      messageObj.paidFee = '0'
      messageObj.value = new FilecoinNumber(messageObj.Value, 'attofil').toFil()
      return messageObj
    }
  }

  const sendMsg = async () => {
    try {
      const message = await send()
      console.log('finished sending message: ', message)
      if (message) {
        dispatch(confirmMessage(toLowerCaseMsgFields(message)))
        setValue(new FilecoinNumber('0', 'fil'))
        close()
      }
    } catch (err) {
      console.log('error when sending message!', err)
      reportError(9, false, err.message, err.stack)
      setUncaughtError(err.message)
      setStep(3)
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
    } else if (step === 1 && !validateAddressString(toAddress)) {
      setToAddressError('Invalid to address')
    } else if (step === 2 && !valueError) {
      setStep(3)
    } else if (
      step === 3 &&
      !isValidForm(
        toAddress,
        value,
        wallet.balance,
        toAddressError,
        valueError,
        uncaughtError
      )
    ) {
      populateErrors()
    } else if (step === 3) {
      setStep(4)
      setAttemptingTx(true)
      // confirmation step happens on ledger device, so we send message one step earlier
      if (wallet.type === LEDGER) {
        await sendMsg()
      }
    } else if (
      step === 4 &&
      !isValidForm(
        toAddress,
        value,
        wallet.balance,
        toAddressError,
        valueError,
        uncaughtError
      )
    ) {
      populateErrors()
    } else if (step === 4) {
      setStep(5)
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

  const { converter, converterError } = useConverter()

  const isSubmitBtnDisabled = () => {
    if (uncaughtError) return false
    if (step === 1 && !toAddress) return true
    if (step === 2 && !isValidAmount(value, wallet.balance, valueError))
      return true
    if (step === 4 && wallet.type === LEDGER) return true
    if (step > 4) return true
  }

  const submitBtnText = () => {
    if (step === 4 && wallet.type !== LEDGER) return 'Send'
    if (step === 4 && wallet.type === LEDGER) return 'Confirm on device.'
    if (step < 4) return 'Next'
    if (step > 4) return 'Send'
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
            {hasError() && (
              <ErrorCard
                error={ledgerError() || uncaughtError}
                reset={() => {
                  setAttemptingTx(false)
                  setUncaughtError('')
                  resetLedgerState()
                  setStep(step - 1)
                }}
              />
            )}
            {!hasError() && attemptingTx && (
              <ConfirmationCard
                walletType={wallet.type}
                currentStep={4}
                totalSteps={4}
                loading={fetchingTxDetails || mPoolPushing}
              />
            )}
            {!hasError() && !attemptingTx && (
              <>
                <StepHeader
                  title='Sending Filecoin'
                  currentStep={step}
                  totalSteps={4}
                  glyphAcronym='Sf'
                />
                <HeaderText
                  step={step}
                  customizingGas={false}
                  walletType={wallet.type}
                />
              </>
            )}
            <Box boxShadow={2} borderRadius={4}>
              <CardHeader
                address={wallet.address}
                balance={wallet.balance}
                customizingGas={false}
              />

              <Box width='100%' p={3} border={0} bg='background.screen'>
                <Input.Address
                  label='Recipient'
                  value={toAddress}
                  onChange={e => setToAddress(e.target.value)}
                  error={toAddressError}
                  disabled={step > 1}
                  placeholder='t1...'
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
                    balance={wallet.balance}
                    error={valueError}
                    setError={setValueError}
                    estimatedTransactionFee={estimatedTransactionFee}
                    disabled={step > 2 && !hasError()}
                  />
                </Box>
              )}
              {step > 2 && (
                <>
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                    p={3}
                    border={0}
                    bg='background.screen'
                  >
                    <Text margin={0}>Transaction Fee</Text>
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
                    // Restore pb to {3} when USD Total bal is restored
                    pb={5}
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
                      <Num display='none' size='m' color='core.darkgray'>
                        {!converterError && value.isGreaterThan(0)
                          ? `${makeFriendlyBalance(
                              converter.fromFIL(value),
                              2
                            )}`
                          : '0'}{' '}
                        USD
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
            my={3}
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
              title={submitBtnText()}
              disabled={isSubmitBtnDisabled()}
              type='submit'
            />
          </Box>
        </Box>
      </Form>
    </>
  )
}

Send.propTypes = {
  close: PropTypes.func.isRequired
}

export default Send
