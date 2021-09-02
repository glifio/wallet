import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { FilecoinNumber, BigNumber } from '@glif/filecoin-number'
import { validateAddressString } from '@glif/filecoin-address'
import { Message } from '@glif/filecoin-message'
import useTransactionHistory from '../../../lib/useTransactionHistory'

// todo: temp remove
import { useRouter } from 'next/router'

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
import ApproximationToggleBtn from '../../Shared/BalanceCard/ApproximationToggleBtn'

const TOTAL_STEPS = 2

const isValidForm = (otherError, paramsError) => {
  return !otherError && !paramsError
}

const speedUpGas = currentGas => {
  // todo

  const foo = FilecoinNumber;
  // todo consider other logic here.
  // E.G. if the gas was way too low, maybe raise it to a recommended floor
  debugger
  return (new FilecoinNumber(currentGas, 'attofil')).multipliedBy(125).dividedBy(100).toString()
}

const SpeedUp = ({ close, transactionId }) => {

  // todo: temp remove
  const router = useRouter()

  const dispatch = useDispatch()
  const wallet = useWallet()

  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState,
  } = useWalletProvider()

  const {
    pending
  } = useTransactionHistory(wallet.address)


  const currentMsg = pending.find(({ cid }) => cid === transactionId)

  // todo
  // check for !currentMsg

  //  todo rename
  const fixParams  = params => {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }

    return params;
  }

  const fixGasFeeCap  = (gasFeeCap, gasPremium) => {
    const bnPremium = new FilecoinNumber(gasPremium, 'attofil')
    const bnFeeCap = new FilecoinNumber(gasFeeCap, 'attofil')
    return bnPremium.isGreaterThan(bnFeeCap) ? gasPremium : gasFeeCap
  }

  const newGasPremium = speedUpGas(currentMsg.gasPremium)

  const [toAddress, setToAddress] = useState(currentMsg.to)
  const [params, setParams] = useState(fixParams(currentMsg.params))
  const [value, setValue] = useState(currentMsg.value)

  // todo #todoEC new ones
  // set this with the new gas premium instead of the old
  const [gasPremium, setGasPremium] = useState(newGasPremium)
  const [nonce, setNonce] = useState(currentMsg.nonce)
  const [gasLimit, setGasLimit] = useState(currentMsg.gasLimit)
  const [gasFeeCap, setGasFeeCap] = useState(fixGasFeeCap(currentMsg.gasFeeCap, newGasPremium))
  const [isExpertMode, setIsExpertMode] = useState(false)

  const [gasInfo, setGasInfo] = useState(emptyGasInfo)
  const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [mPoolPushing, setMPoolPushing] = useState(false)
  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)

  const [toAddressError, setToAddressError] = useState('')
  const [paramsError, setParamsError] = useState('')
  const [valueError, setValueError] = useState('')
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
      const message = new Message({
        to: toAddress,
        from: wallet.address,
        method: 0,

        // todo: #todoEC: hmm, are these formatted wrong? Parsing as an int didn't help...
        value,
        gasFeeCap,
        gasLimit,
        gasPremium,
        // value: parseInt(value, 10),
        // gasFeeCap: parseInt(gasFeeCap, 10),
        // gasLimit: parseInt(gasLimit, 10),
        // gasPremium: parseInt(gasPremium, 10),
        nonce,
        params
      })

      // todo: #todoEC: it seems to be failing after here.
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
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
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
              {/* todo update */}
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
              <Box boxShadow={2} borderRadius={4} bg='background.screen'>
                {/* TODO do we need to pass a prop to change Ms to Su here? */}
                <CardHeader
                  address={wallet.address}
                  signerBalance={wallet.balance}
                />
                {step === 1 && (
                  <>
                    <Box width='100%' p={3} border={0}>
                      <Input.Text
                        my={3}
                        textAlign='right'
                        label='Transaction Id'
                        value={transactionId}
                        disabled
                      />
                      <Input.Text
                        my={3}
                        textAlign='right'
                        label='Nonce'
                        value={nonce}
                        disabled
                      />
                      <Input.Text
                        my={3}
                        textAlign='right'
                        label='Gas Premium'
                        value={gasPremium}
                        disabled
                      />
                      <Input.Text
                        my={3}
                        textAlign='right'
                        label='Gas Limit'
                        value={gasLimit}
                        disabled
                      />
                      <Input.Text
                        my={3}
                        textAlign='right'
                        label='Fee Cap'
                        value={gasFeeCap}
                        disabled
                      />
                    </Box>
                    <Box
                      width='100%'
                      p={3}
                      border={0}
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      {/* todo: does this component exist already? Fix styles */}
                      <label>Expert Mode</label>
                      <Button
                        justifySelf='end'
                        title={isExpertMode ? 'on' : 'off'}
                        variant='secondary'
                        onClick={() => setIsExpertMode(!isExpertMode)}
                      />
                    </Box>
                  </>
                )}

                {step === 2 && (
                  <Box
                    width='100%'
                    px={3}
                    pb={step === 2 && 3}
                    border={0}
                    bg='background.screen'
                  >
                    <Box my={5}>Confirmation screen goes here.</Box>
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
              <Button variant='primary' title={submitBtnText()} type='submit' />
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
