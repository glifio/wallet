import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'
import Message from '@openworklabs/filecoin-message'
import { validateAddressString } from '@openworklabs/filecoin-address'

import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { useConverter } from '../../../lib/Converter'
import {
  Box,
  Button,
  ButtonClose,
  StepHeader,
  Input,
  Text,
  IconLedger,
  Num,
  Title
} from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import { GasCustomization, CardHeader, WithdrawHeaderText } from '../Shared'
import { useWasm } from '../../../lib/WasmLoader'
import ErrorCard from '../../Wallet/Send.js/ErrorCard'
import ConfirmationCard from '../../Wallet/Send.js/ConfirmationCard'
import { LEDGER } from '../../../constants'
import {
  reportLedgerConfigError,
  hasLedgerError
} from '../../../utils/ledger/reportLedgerConfigError'
import reportError from '../../../utils/reportError'

const isValidAmount = (value, balance, errorFromForms) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThan(value)
  return valueFieldFilledOut && enoughInTheBank && !errorFromForms
}

const Withdrawing = ({ address, balance, close }) => {
  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState
  } = useWalletProvider()
  const wallet = useWallet()
  const { serializeParams } = useWasm()
  const { converter, converterError } = useConverter()

  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [value, setValue] = useState(new FilecoinNumber('0', 'fil'))
  const [valueError, setValueError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [gasPrice, setGasPrice] = useState(new FilecoinNumber('1', 'attofil'))
  const [gasLimit, setGasLimit] = useState(
    new FilecoinNumber('5000', 'attofil')
  )
  const [estimatedGasUsed, setEstimatedGasUsed] = useState(
    new FilecoinNumber('0', 'attofil')
  )
  const [customizingGas, setCustomizingGas] = useState(false)

  const estimateGas = async (gp, gasLimit, value) => {
    // create a fake message
    const params = {
      to: toAddress,
      value,
      method: 0,
      params: ''
    }

    const serializedParams = Buffer.from(
      serializeParams(params),
      'hex'
    ).toString('base64')

    const message = new Message({
      to: address,
      from: wallet.address,
      value: '0',
      method: 2,
      gasPrice: gp.toAttoFil(),
      gasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber(),
      nonce: 0,
      params: serializedParams
    })

    // HMR causes this condition, we just make this check for easier dev purposes
    return walletProvider
      ? walletProvider.estimateGas(message.encode())
      : new FilecoinNumber('122', 'attofil')
  }

  const sendMsg = async () => {
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

      const messageForSigning = new Message({
        to: address,
        from: wallet.address,
        value: '0',
        method: 2,
        gasPrice: gasPrice.toAttoFil(),
        gasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber(),
        nonce,
        // signature requires hex params
        params: serializedParams.toString('hex')
      })

      const signedMessage = await provider.wallet.sign(
        messageForSigning,
        wallet.path
      )

      const messageForLotus = new Message({
        to: address,
        from: wallet.address,
        value: '0',
        method: 2,
        gasPrice: gasPrice.toAttoFil(),
        gasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber(),
        nonce,
        // lotus requires base64 params
        params: serializedParams.toString('base64')
      })

      const messageObj = messageForLotus.toString()
      const msgCid = await provider.sendMessage(messageObj, signedMessage)
      messageObj.cid = msgCid['/']
      messageObj.timestamp = dayjs().unix()
      messageObj.gas_used = (
        await walletProvider.estimateGas(messageForLotus.encode())
      ).toAttoFil()
      messageObj.Value = new FilecoinNumber(messageObj.value, 'attofil').toFil()
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
          setValue(new FilecoinNumber('0', 'fil'))
          close()
        }
      } catch (err) {
        reportError(20, false, err, err.message, err.stack)
        setUncaughtError(err.message || err)
        setAttemptingTx(false)
        setStep(2)
      }
    }
  }

  const isSubmitBtnDisabled = () => {
    if (uncaughtError) return false
    if (customizingGas) return true
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
      <Box
        width='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        mb={7}
      >
        <Box
          maxWidth={14}
          width={13}
          minWidth={12}
          display='flex'
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
                  <WithdrawHeaderText
                    step={step}
                    customizingGas={customizingGas}
                  />
                </>
              )}
            <Box boxShadow={2} borderRadius={4}>
              <CardHeader
                address={address}
                balance={balance}
                customizingGas={customizingGas}
              />
              {!customizingGas && (
                <>
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
                    <Box
                      width='100%'
                      p={3}
                      border={0}
                      bg='background.screen'
                      // boxShadow={2}
                    >
                      <Input.Funds
                        name='amount'
                        label='Amount'
                        amount={value.toAttoFil()}
                        onAmountChange={setValue}
                        balance={balance}
                        error={valueError}
                        setError={setValueError}
                        // since the ledger device pays the gas fee, we dont include that in the funds input
                        gasLimit={new FilecoinNumber('0', 'attofil')}
                        disabled={step === 3}
                      />
                    </Box>
                  )}
                  {step > 2 && (
                    <Box
                      display='flex'
                      flexDirection='row'
                      justifyContent='space-between'
                      width='100%'
                      p={3}
                      border={0}
                      bg='background.screen'
                    >
                      <Box>
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
                      </Box>
                      <Box display='flex' flexDirection='row'>
                        <Button
                          p={2}
                          alignSelf='center'
                          title='Change'
                          variant='secondary'
                          onClick={() => setCustomizingGas(true)}
                        />
                        <Text ml={2} color='core.primary'>
                          {'< 0.0001 FIL'}
                        </Text>
                      </Box>
                    </Box>
                  )}
                </>
              )}
              {customizingGas && (
                <GasCustomization
                  show
                  estimateGas={estimateGas}
                  gasPrice={gasPrice}
                  gasLimit={gasLimit}
                  setGasPrice={setGasPrice}
                  setGasLimit={setGasLimit}
                  setEstimatedGas={setEstimatedGasUsed}
                  estimatedGasUsed={estimatedGasUsed}
                  value={value.toAttoFil()}
                  walletBalance={makeFriendlyBalance(wallet.balance, 6, true)}
                  close={() => setCustomizingGas(false)}
                />
              )}
              {step > 2 && !customizingGas && (
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='flex-start'
                  justifyContent='space-between'
                  py={3}
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
                    <Num size='m' color='core.darkgray'>
                      {!converterError && value.isGreaterThan(0)
                        ? `${makeFriendlyBalance(converter.fromFIL(value), 2)}`
                        : '0'}{' '}
                      USD
                    </Num>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            position='fixed'
            bottom='3'
            margin='auto'
            left='0'
            right='0'
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
              disabled={customizingGas || attemptingTx}
            />
            <Button
              variant='primary'
              title='Next'
              disabled={isSubmitBtnDisabled()}
              onClick={onSubmit}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}

Withdrawing.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP,
  close: PropTypes.func.isRequired
}

export default Withdrawing
