import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number'
import { Message } from '@glif/filecoin-message'
import { validateAddressString } from '@glif/filecoin-address'
import {
  Box,
  Button,
  ButtonClose,
  StepHeader,
  Num,
  Title,
  Form,
  Card
} from '@glif/react-components'
import { useRouter } from 'next/router'

import { useMsig } from '../../../MsigProvider'
import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { Input } from '../../Shared'
import { CardHeader, WithdrawHeaderText } from '../Shared'
import { useWasm } from '../../../lib/WasmLoader'
import ErrorCard from '../../Wallet/Send/ErrorCard'
import ConfirmationCard from '../../Wallet/Send/ConfirmationCard'
import CustomizeFee from '../../Wallet/Send/CustomizeFee'
import { LEDGER, PROPOSE, emptyGasInfo, PAGE } from '../../../constants'
import {
  reportLedgerConfigError,
  hasLedgerError
} from '../../../utils/ledger/reportLedgerConfigError'
import reportError from '../../../utils/reportError'
import { confirmMessage } from '../../../store/actions'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import { navigate } from '../../../utils/urlParams'

const isValidAmount = (value, balance, errorFromForms) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThanOrEqualTo(value)
  return valueFieldFilledOut && enoughInTheBank && !errorFromForms
}

const Withdrawing = () => {
  const { ledger, connectLedger, resetLedgerState } = useWalletProvider()
  const wallet = useWallet()
  const dispatch = useDispatch()
  // @ts-expect-error
  const { serializeParams } = useWasm()
  const { Address: address, AvailableBalance: balance } = useMsig()
  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [value, setValue] = useState(new FilecoinNumber('0', 'fil'))
  const [valueError, setValueError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [gasError, setGasError] = useState('')
  const [gasInfo, setGasInfo] = useState(emptyGasInfo)
  const [frozen, setFrozen] = useState(false)
  const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
  const [mPoolPushing, setMPoolPushing] = useState(false)
  const router = useRouter()

  const onClose = useCallback(() => {
    navigate(router, { pageUrl: PAGE.MSIG_HOME })
  }, [router])

  const onComplete = useCallback(() => {
    navigate(router, { pageUrl: PAGE.MSIG_HISTORY })
  }, [router])

  const constructMsg = (nonce = 0) => {
    const params = {
      to: toAddress,
      value: value.toAttoFil(),
      method: 0,
      params: ''
    }

    const serializedParams = Buffer.from(serializeParams(params), 'hex')
    return {
      message: new Message({
        to: address,
        from: wallet.address,
        value: '0',
        method: 2,
        nonce,
        params: serializedParams.toString('base64'),
        gasFeeCap: gasInfo.gasFeeCap.toAttoFil(),
        gasLimit: new BigNumber(gasInfo.gasLimit.toAttoFil()).toNumber(),
        gasPremium: gasInfo.gasPremium.toAttoFil()
      }),
      params
    }
  }

  const sendMsg = async () => {
    setFetchingTxDetails(true)
    const provider = await connectLedger()

    if (provider) {
      const nonce = await provider.getNonce(wallet.address)
      const { message, params } = constructMsg(nonce)

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
        // @ts-expect-error
        const messageForTxHistory: LotusMessage & {
          cid: string
          timestamp: number
          maxFee: string
          paidFee: string
          value: string
          method: string
          params: string | object
        } = { ...messageObj }
        messageForTxHistory.cid = msgCid['/']
        messageForTxHistory.timestamp = dayjs().unix()
        messageForTxHistory.maxFee = gasInfo.estimatedTransactionFee.toAttoFil()
        // dont know how much was actually paid in this message yet, so we mark it as 0
        messageForTxHistory.paidFee = '0'
        messageForTxHistory.value = new FilecoinNumber(
          messageObj.Value,
          'attofil'
        ).toFil()
        // reformat the params and method for tx table
        messageForTxHistory.params = params
        messageForTxHistory.method = PROPOSE
        return messageForTxHistory
      }
      throw new Error('Filecoin message invalid. No gas or fees were spent.')
    }
    throw new Error('There was an issue when sending your message.')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (step === 1 && validateAddressString(toAddress)) {
      setStep(2)
    } else if (step === 1 && !validateAddressString(toAddress)) {
      setToAddressError('Invalid to address')
    } else if (step === 2 && !valueError) {
      setStep(3)
    } else if (step === 3) {
      setStep(4)
    } else if (step === 4) {
      setAttemptingTx(true)
      try {
        const msg = await sendMsg()
        setAttemptingTx(false)
        if (msg) {
          dispatch(confirmMessage(toLowerCaseMsgFields(msg)))
          setValue(new FilecoinNumber('0', 'fil'))
          onComplete()
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
        } else if (
          err.message
            .toLowerCase()
            .includes('data is invalid : unexpected method')
        ) {
          setUncaughtError(
            'Please make sure expert mode is enabled on your Ledger Filecoin app.'
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
    if (frozen) return true
    if (uncaughtError) return true
    if (attemptingTx) return true
    if (step === 1 && !toAddress) return true
    if (step === 2 && !isValidAmount(value, balance, valueError)) return true
    if (step === 3 && gasError) return true
    if (step > 4) return true
  }

  const isBackBtnDisabled = () => {
    if (frozen) return true
    if (attemptingTx) return true
    if (fetchingTxDetails) return true
    if (mPoolPushing) return true
    return false
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
            setAttemptingTx(false)
            setUncaughtError('')
            setGasError('')
            resetLedgerState()
            onClose()
          }}
        />
        <Form onSubmit={onSubmit}>
          <Box
            maxWidth={13}
            width='100%'
            minWidth={11}
            display='flex'
            flexDirection='column'
            justifyContent='flex-start'
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
                    setGasError('')
                    resetLedgerState()
                    setStep(2)
                  }}
                />
              )}
              {attemptingTx && (
                <ConfirmationCard
                  loading={fetchingTxDetails || mPoolPushing}
                  walletType={LEDGER}
                  currentStep={5}
                  totalSteps={5}
                  msig
                />
              )}
              {!attemptingTx &&
                !hasLedgerError({ ...ledger, otherError: uncaughtError }) && (
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
                        title='Withdrawing Filecoin'
                        currentStep={step}
                        totalSteps={5}
                        glyphAcronym='Wd'
                      />
                      <Box mt={3} mb={4}>
                        <WithdrawHeaderText step={step} />
                      </Box>
                    </Card>
                  </>
                )}
              <Box boxShadow={2} borderRadius={4}>
                <CardHeader
                  msig
                  address={address}
                  msigBalance={balance}
                  signerBalance={wallet.balance}
                />
                <Box width='100%' p={3} border={0} bg='background.screen'>
                  <Input.Address
                    // @ts-expect-error
                    label='Recipient'
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    error={toAddressError}
                    disabled={step >= 2}
                    onFocus={() => {
                      if (toAddressError) setToAddressError('')
                    }}
                  />
                </Box>
                {step > 1 && (
                  <Box width='100%' p={3} border={0} bg='background.screen'>
                    <Input.Funds
                      // @ts-expect-error
                      name='amount'
                      label='Amount'
                      amount={value.toAttoFil()}
                      onAmountChange={setValue}
                      balance={balance}
                      error={valueError}
                      setError={setValueError}
                      disabled={step === 3}
                    />
                  </Box>
                )}
                {step > 2 && (
                  <>
                    <Box
                      width='100%'
                      px={3}
                      pb={step === 3 && 3}
                      border={0}
                      bg='background.screen'
                    >
                      <CustomizeFee
                        message={constructMsg().message.toLotusType()}
                        gasInfo={gasInfo}
                        setGasInfo={setGasInfo}
                        setFrozen={setFrozen}
                        setError={setGasError}
                        error={gasError}
                        feeMustBeLessThanThisAmount={wallet.balance}
                      />
                    </Box>
                    {step > 3 && (
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
                    )}
                  </>
                )}
              </Box>
            </Box>

            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-between'
              alignItems='flex-end'
              margin='auto'
              maxWidth={13}
              width='100%'
              minWidth={11}
              maxHeight={12}
              py={4}
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
                    onClose()
                  } else {
                    setStep(step - 1)
                  }
                }}
                disabled={isBackBtnDisabled()}
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
      </Box>
    </>
  )
}

export default Withdrawing
