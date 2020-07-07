import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import { useWalletProvider } from '../../../WalletProvider'
import {
  Box,
  Button,
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

const Withdrawing = ({ address, balance }) => {
  const dispatch = useDispatch()
  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState
  } = useWalletProvider()
  const [step, setStep] = useState(2)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [value, setValue] = useState(new FilecoinNumber('0', 'fil'))
  const [valueError, setValueError] = useState('')
  const [gasPrice, setGasPrice] = useState(new FilecoinNumber('1', 'attofil'))
  const [gasLimit, setGasLimit] = useState(
    new FilecoinNumber('1000', 'attofil')
  )
  const [estimatedGasUsed, setEstimatedGasUsed] = useState(
    new FilecoinNumber('0', 'attofil')
  )
  const [customizingGas, setCustomizingGas] = useState(false)

  const estimateGas = noop

  const onSubmit = e => {
    e.preventDefault()
    console.log()
  }

  return (
    <>
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
            {/* <StepHeader
              title='Withdrawing Filecoin'
              currentStep={1}
              totalSteps={3}
              glyphAcronym='Wd'
            />
            <Text textAlign='center'>
              First, please confirm the account you&apos;re sending from, and
              the recipient you want to send to.
            </Text> */}
            <CardHeader address={address} balance={balance} />
            <Box width='100%' p={3} border={0} bg='background.screen'>
              <Input.Address
                label='Recipient'
                value={toAddress}
                onChange={e => setToAddress(e.target.value)}
                setError={setToAddressError}
                error={toAddressError}
              />
            </Box>
            {step > 1 && (
              <Box width='100%' p={3} border={0} bg='background.screen'>
                <Input.Funds
                  name='amount'
                  label='Amount'
                  amount={value.toAttoFil()}
                  onAmountChange={setValue}
                  balance={new FilecoinNumber('10', 'fil')}
                  error={valueError}
                  setError={setValueError}
                  gasLimit={new FilecoinNumber('1000', 'attofil')}
                  // disabled={step === 2 && !hasError()}
                  // valid={isValidAmount(value, wallet.balance, valueError)}
                />
              </Box>
            )}
            <Box width='100%' p={3} border={0} bg='background.screen'>
              <Input.Text
                onChange={noop}
                denom={customizingGas ? 'AttoFil' : 'FIL'}
                label='Transaction Fee'
                value={customizingGas ? estimatedGasUsed.toAttoFil() : '< 0.1'}
                disabled
              />
            </Box>
          </Box>
          <GasCustomization
            show={true}
            estimateGas={estimateGas}
            gasPrice={gasPrice}
            gasLimit={gasLimit}
            setGasPrice={setGasPrice}
            setGasLimit={setGasLimit}
            setEstimatedGas={setEstimatedGasUsed}
            value={value.toAttoFil()}
          />
          <FloatingContainer margin='auto' left='0' right='0'>
            <Button variant='secondary' title='Cancel' />
            <Button variant='primary' title='Next' onClick={onSubmit} />
          </FloatingContainer>
        </Box>
      </Box>
    </>
  )
}

Withdrawing.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP
}

export default Withdrawing
