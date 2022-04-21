import React, { useCallback, useMemo, useState } from 'react'
import { FilecoinNumber, BigNumber } from '@glif/filecoin-number'
import { validateAddressString } from '@glif/filecoin-address'
import { Message } from '@glif/filecoin-message'
import { useRouter } from 'next/router'

import {
  Box,
  Num,
  MessagePending as MessagePendingGQL,
  Button,
  StepHeader,
  Title,
  Form,
  Card,
  Input,
  TransactionHeader,
  useSubmittedMessages,
  ErrorCard
} from '@glif/react-components'
import {
  useWalletProvider,
  useWallet,
  ConfirmationCard,
  CustomizeFee
} from '@glif/wallet-provider-react'

import HeaderText from './HeaderText'
import { LEDGER, emptyGasInfo, PAGE, METAMASK } from '../../../constants'
import isBase64 from '../../../utils/isBase64'
import { navigate } from '../../../utils/urlParams'
import { logger } from '../../../logger'

// this is a bit confusing, sometimes the form can report errors, so we check those here too
const isValidAmount = (value, balance, errorFromForms) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThanOrEqualTo(value)
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
  otherError,
  paramsError
) => {
  const validToAddress = isValidAddress(toAddress, toAddressError)
  const validAmount = isValidAmount(value, balance, valueError)
  return validToAddress && validAmount && !otherError && !paramsError
}

const Send = () => {
  const wallet = useWallet()
  const { pushPendingMessage } = useSubmittedMessages()
  const {
    resetWalletError,
    loginOption,
    getProvider,
    walletError,
    walletProvider
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

  const router = useRouter()

  const onClose = useCallback(() => {
    navigate(router, { pageUrl: PAGE.WALLET_HOME })
  }, [router])

  const onComplete = useCallback(() => {
    navigate(router, { pageUrl: PAGE.WALLET_HOME })
  }, [router])

  const send = async () => {
    setFetchingTxDetails(true)
    const provider = await getProvider()
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
      const messageObj = message.toLotusType()
      const signedMessage = await provider.wallet.sign(
        wallet.address,
        messageObj
      )

      setMPoolPushing(true)
      const validMsg = await provider.simulateMessage(messageObj)
      if (validMsg) {
        const msgCid = await provider.sendMessage(signedMessage)
        return message.toPendingMessage(msgCid['/']) as MessagePendingGQL
      }
      throw new Error('Filecoin message invalid. No gas or fees were spent.')
    }
  }

  const sendMsg = async () => {
    try {
      const pendingMsg = await send()
      if (pendingMsg) {
        setValue(new FilecoinNumber('0', 'fil'))
        pushPendingMessage(pendingMsg)
        onComplete()
      }
    } catch (err) {
      if (err.message.includes('Unexpected number of items')) {
        setUncaughtError(
          'Ledger devices cannot sign arbitrary base64 params yet. Coming soon.'
        )
      } else {
        logger.error(
          err instanceof Error ? err.message : JSON.stringify(err),
          'Wallet/Send'
        )
        setUncaughtError(err.message)
      }
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

  const onSubmit = async (e) => {
    e.preventDefault()
    if (step === 1 && validateAddressString(toAddress)) {
      setStep(2)
    } else if (step === 1 && !validateAddressString(toAddress)) {
      setToAddressError('Invalid to address')
    } else if (step === 2 && !valueError) {
      setStep(3)
    } else if (step === 3 && (!params || isBase64(params))) {
      // TODO - get rid of this once ledger supports params
      if (loginOption === LEDGER && params) {
        setParamsError(
          'Ledger devices cannot sign base64 params yet. Coming soon.'
        )
      } else {
        setStep(4)
      }
    } else if (step === 3) {
      setParamsError('Invalid base64 params')
    } else if (step === 4) {
      setStep(5)
    } else if (
      step === 5 &&
      !isValidForm(
        toAddress,
        value,
        wallet.balance,
        toAddressError,
        valueError,
        uncaughtError,
        paramsError
      )
    ) {
      populateErrors()
    } else if (step === 5) {
      setStep(6)
      setAttemptingTx(true)
      // confirmation step happens on ledger device, so we send message one step earlier
      if (loginOption === LEDGER || loginOption === METAMASK) {
        await sendMsg()
      }
    } else if (
      step === 6 &&
      !isValidForm(
        toAddress,
        value,
        wallet.balance,
        toAddressError,
        valueError,
        uncaughtError,
        paramsError
      )
    ) {
      populateErrors()
    } else if (step === 6) {
      setStep(7)
      await sendMsg()
    }
  }

  // here we need to wrap attofil in raw BN because we get super small decimal
  const calcMaxAffordableFee = () => {
    const affordableFee = wallet.balance.minus(value)
    return new FilecoinNumber(affordableFee, 'fil')
  }

  const errorMsg = useMemo(() => {
    if (walletError()) return walletError()
    if (uncaughtError) return uncaughtError
    return ''
  }, [uncaughtError, walletError])

  const isSubmitBtnDisabled = () => {
    if (frozen) return true
    if (uncaughtError) return false
    if (step === 1 && !toAddress) return true
    if (step === 2 && !isValidAmount(value, wallet.balance, valueError))
      return true
    if (step === 4 && gasError) return true
    if (step === 6 && loginOption === LEDGER) return true
    if (step === 6 && loginOption === METAMASK) return true
    if (step > 6) return true
  }

  const isBackBtnDisabled = () => {
    if (frozen) return true
    if (loginOption === METAMASK && attemptingTx) return true
    if (loginOption === LEDGER && attemptingTx) return true
    if (fetchingTxDetails) return true
    if (mPoolPushing) return true
    return false
  }

  const submitBtnText = () => {
    if (step === 6 && loginOption !== LEDGER) return 'Send'
    if (step === 6 && loginOption === LEDGER) return 'Confirm on device.'
    if (step < 6) return 'Next'
    if (step > 6) return 'Send'
  }

  return (
    <Box display='flex' flexDirection='column' width='100%'>
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
            {!!errorMsg && (
              <ErrorCard
                error={errorMsg}
                reset={() => {
                  setAttemptingTx(false)
                  setUncaughtError('')
                  setGasError('')
                  setParamsError('')
                  resetWalletError()
                  setStep(step - 1)
                }}
              />
            )}
            {!errorMsg && attemptingTx && (
              <ConfirmationCard
                loginOption={loginOption}
                currentStep={6}
                totalSteps={6}
                loading={fetchingTxDetails || mPoolPushing}
              />
            )}
            {!errorMsg && !attemptingTx && (
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
                    title='Sending Filecoin'
                    currentStep={step}
                    totalSteps={6}
                    glyphAcronym='Sf'
                  />
                  <Box mt={6} mb={4}>
                    <HeaderText step={step} walletType={loginOption} />
                  </Box>
                </Card>
              </>
            )}
            <Box boxShadow={2} borderRadius={4}>
              <TransactionHeader address={wallet.address} balance={wallet.balance} />

              <Box width='100%' p={3} border={0} bg='background.screen'>
                <Input.Address
                  label='Recipient'
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
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
                      disabled={step > 2 && !errorMsg}
                    />
                  </Box>
                )}
                {step > 2 && (
                  <Box width='100%' p={3} border={0} bg='background.screen'>
                    <Input.Text
                      label='Params'
                      value={params}
                      onChange={(e) => setParams(e.target.value)}
                      error={paramsError}
                      disabled={step > 3}
                      placeholder='Optional base64 params'
                      onFocus={() => {
                        if (paramsError) setParamsError('')
                      }}
                    />
                  </Box>
                )}
                {step > 3 && (
                  <Box
                    width='100%'
                    px={3}
                    pb={step === 4 && 3}
                    border={0}
                    bg='background.screen'
                  >
                    <CustomizeFee
                      message={new Message({
                        to: toAddress,
                        from: wallet.address,
                        value: value.toAttoFil(),
                        nonce: 0,
                        method: 0,
                        params,
                        gasFeeCap: gasInfo.gasFeeCap.toAttoFil(),
                        gasLimit: new BigNumber(
                          gasInfo.gasLimit.toAttoFil()
                        ).toNumber(),
                        gasPremium: gasInfo.gasPremium.toAttoFil()
                      }).toLotusType()}
                      gasInfo={gasInfo}
                      setGasInfo={setGasInfo}
                      setFrozen={setFrozen}
                      setError={setGasError}
                      error={gasError}
                      feeMustBeLessThanThisAmount={calcMaxAffordableFee()}
                      wallet={wallet}
                      gasEstimateMaxFee={walletProvider.gasEstimateMaxFee}
                      gasEstimateMessageGas={
                        walletProvider.gasEstimateMessageGas
                      }
                    />
                  </Box>
                )}
              </Box>
              {step > 4 && (
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='flex-start'
                  justifyContent='space-between'
                  pt={6}
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
                      {new FilecoinNumber(
                        value.plus(gasInfo.estimatedTransactionFee),
                        'fil'
                      ).toFil()}{' '}
                      FIL
                    </Num>
                  </Box>
                </Box>
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
                setParamsError('')
                resetWalletError()
                if (step === 1) {
                  onClose()
                } else {
                  setStep(step - 1)
                }
              }}
              disabled={isBackBtnDisabled()}
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
    </Box>
  )
}

export default Send
