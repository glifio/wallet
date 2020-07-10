import React, { useCallback, useState } from 'react'
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
  StepHeader,
  Input,
  Text,
  IconLedger
} from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import GasCustomization from './GasCustomization'
import { useWasm } from '../../../lib/WasmLoader'
import { CardHeader, HeaderText } from './Headers'

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
  const [step, setStep] = useState(3)
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
  const [customizingGas, setCustomizingGas] = useState(true)

  const estimateGas = useCallback(
    async (gp, gasLimit, value) => {
      // create a fake message
      const params = {
        to: wallet.address,
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
        from: 't01',
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
    },
    [address, serializeParams, wallet.address, walletProvider]
  )

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

        const message = new Message({
          to: address,
          from: wallet.address,
          value: '0',
          method: 2,
          gasPrice: gasPrice.toAttoFil(),
          gasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber(),
          nonce,
          params
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
    if (customizingGas) return true
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
            <StepHeader
              title='Withdrawing Filecoin'
              currentStep={step}
              totalSteps={4}
              glyphAcronym='Wd'
            />
            <HeaderText step={step} />
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
                      <Text margin={0} color='core.darkgray'>
                        Paid via <IconLedger />{' '}
                        {makeFriendlyBalance(wallet.balance, 6, true)} FIL
                      </Text>
                    </Box>
                    <Box display='flex' flexDirection='row'>
                      <Button
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
          </Box>
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
              disabled={customizingGas}
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
