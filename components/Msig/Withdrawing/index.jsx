import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'
import Message from '@openworklabs/filecoin-message'
import { validateAddressString } from '@openworklabs/filecoin-address'

import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import {
  Box,
  Button,
  ButtonClose,
  FloatingContainer,
  StepHeader,
  Input,
  Text,
  Glyph
} from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import noop from '../../../utils/noop'
import GasCustomization from '../../Wallet/Send.js/GasCustomization'
import { useWasm } from '../../../lib/WasmLoader'

const CardHeader = ({ address, balance }) => {
  return (
    <Box
      width='100%'
      p={3}
      border={1}
      borderTopRightRadius={3}
      borderTopLeftRadius={3}
      bg='core.primary'
      color='core.white'
    >
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box display='flex' flexDirection='row'>
          <Glyph acronym='Ac' color='white' mr={3} />
          <Box display='flex' flexDirection='column' alignItems='flex-start'>
            <Text m={0}>From</Text>
            <Text m={0}>{address}</Text>
          </Box>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='flex-start'>
          <Text m={0}>Balance</Text>
          <Text m={0}>{makeFriendlyBalance(balance, 6, true)} FIL</Text>
        </Box>
      </Box>
    </Box>
  )
}

CardHeader.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP
}

const HeaderText = ({ step }) => {
  let text = ''

  switch (step) {
    case 1:
      text =
        "First, please confirm the account you're sending from, and the recipient you want to send to."
      break
    case 2:
      text = "Next, please choose an amount of FIL you'd like to withdraw."
      break
    case 3:
      text = 'Please review the transaction details.'
      break
    default:
      text = ''
  }
  return <Text textAlign='center'>{text}</Text>
}

HeaderText.propTypes = {
  step: PropTypes.number.isRequired
}

const isValidAmount = (value, balance, errorFromForms) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThan(value)
  return valueFieldFilledOut && enoughInTheBank && !errorFromForms
}

const Withdrawing = ({ address, balance, close }) => {
  const dispatch = useDispatch()
  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState
  } = useWalletProvider()
  const wallet = useWallet()
  const { serializeParams } = useWasm()
  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [value, setValue] = useState(new FilecoinNumber('0', 'fil'))
  const [valueError, setValueError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [gasPrice, setGasPrice] = useState(new FilecoinNumber('1', 'attofil'))
  const [gasLimit, setGasLimit] = useState(
    new FilecoinNumber('1000', 'attofil')
  )
  const [estimatedGasUsed, setEstimatedGasUsed] = useState(
    new FilecoinNumber('0', 'attofil')
  )
  const [customizingGas, setCustomizingGas] = useState(false)

  const estimateGas = noop

  const onSubmit = async e => {
    e.preventDefault()
    if (step === 1 && validateAddressString(toAddress)) {
      setStep(2)
    } else if (step === 1 && !validateAddressString(toAddress)) {
      setToAddressError('Invalid to address')
    } else if (step === 2 && !valueError) setStep(3)
    else if (step === 3) {
      setAttemptingTx(true)
      const provider = await connectLedger()

      if (provider) {
        const nonce = await provider.getNonce(wallet.address)
        const params = {
          to: toAddress,
          value: value.toAttoFil(),
          method: 0,
          params: ''
        }

        const serializedParams = serializeParams(params).toString('hex')

        const message = new Message({
          to: address,
          from: wallet.address,
          value: '0',
          method: 2,
          gasPrice: gasPrice.toAttoFil(),
          gasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber(),
          nonce,
          params: serializedParams
        })

        const signedMessage = await provider.wallet.sign(wallet.path, message)
        // const messageObj = message.toString()
        // const msgCid = await provider.sendMessage(messageObj, signedMessage)
        // messageObj.cid = msgCid['/']
        // messageObj.timestamp = dayjs().unix()
        // messageObj.gas_used = (
        //   await walletProvider.estimateGas(messageObj)
        // ).toAttoFil()
        // messageObj.Value = new FilecoinNumber(messageObj.value, 'attofil').toFil()
        // return messageObj
      }
      return null
    }
  }

  const isSubmitBtnDisabled = () => {
    if (uncaughtError) return false
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
            <StepHeader
              title='Withdrawing Filecoin'
              currentStep={step}
              totalSteps={4}
              glyphAcronym='Wd'
            />
            <HeaderText step={step} />
            <CardHeader address={address} balance={balance} />
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
                  gasLimit={new FilecoinNumber('0', 'attofil')}
                  disabled={step === 3}
                />
              </Box>
            )}
            {step > 2 && (
              <Box width='100%' p={3} border={0} bg='background.screen'>
                <Input.Text
                  onChange={noop}
                  denom={customizingGas ? 'AttoFil' : 'FIL'}
                  label='Transaction Fee'
                  value={
                    customizingGas ? estimatedGasUsed.toAttoFil() : '< 0.1'
                  }
                  disabled
                />
              </Box>
            )}
          </Box>
          <GasCustomization
            show={step > 2}
            estimateGas={estimateGas}
            gasPrice={gasPrice}
            gasLimit={gasLimit}
            setGasPrice={setGasPrice}
            setGasLimit={setGasLimit}
            setEstimatedGas={setEstimatedGasUsed}
            value={value.toAttoFil()}
          />
          <FloatingContainer margin='auto' left='0' right='0'>
            <Button
              type='button'
              title='Back'
              variant='secondary'
              border={0}
              borderRight={1}
              borderRadius={0}
              borderColor='core.lightgray'
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
            />
            <Button
              variant='primary'
              title='Next'
              disabled={isSubmitBtnDisabled()}
              onClick={onSubmit}
            />
          </FloatingContainer>
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
