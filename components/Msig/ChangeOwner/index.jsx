import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
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
import { GasCustomization, CardHeader, ChangeOwnerHeaderText } from '../Shared'
import Preface from './Preface'
import { useWasm } from '../../../lib/WasmLoader'
import ErrorCard from '../../Wallet/Send.js/ErrorCard'
import ConfirmationCard from '../../Wallet/Send.js/ConfirmationCard'
import { LEDGER } from '../../../constants'
import {
  reportLedgerConfigError,
  hasLedgerError
} from '../../../utils/ledger/reportLedgerConfigError'
import reportError from '../../../utils/reportError'

const ChangeOwner = ({ address, balance, close }) => {
  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState
  } = useWalletProvider()
  const wallet = useWallet()
  const { serializeParams, transactionSerialize } = useWasm()

  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [gasPrice, setGasPrice] = useState(new FilecoinNumber('1', 'attofil'))
  const [gasLimit, setGasLimit] = useState(
    new FilecoinNumber('5000', 'attofil')
  )
  const [estimatedGasUsed, setEstimatedGasUsed] = useState(
    new FilecoinNumber('0', 'attofil')
  )
  const [customizingGas, setCustomizingGas] = useState(false)

  const estimateGas = async (gp, gasLimit) => {
    let message
    try {
      // create a fake message
      const innerParams = {
        to: toAddress,
        from: wallet.address
      }

      const serializedInnerParams = Buffer.from(
        serializeParams(innerParams),
        'hex'
      ).toString('base64')

      const innerMessage = {
        to: address,
        value: '0',
        method: 7,
        params: serializedInnerParams
      }

      const serializedInnerMessage = transactionSerialize(innerMessage)

      message = new Message({
        to: address,
        from: wallet.address,
        value: '0',
        method: 2,
        gasPrice: gp.toAttoFil(),
        gasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber(),
        nonce: 0,
        params: serializedInnerMessage
      })
    } catch (err) {
      reportError(23, false, err)
      setUncaughtError(err.message)
    }
    // HMR causes this condition, we just make this check for easier dev purposes
    return walletProvider
      ? walletProvider.estimateGas(message.encode())
      : new FilecoinNumber('122', 'attofil')
  }

  const sendMsg = async () => {
    const provider = await connectLedger()

    if (provider) {
      const nonce = await provider.getNonce(wallet.address)
      const innerParams = {
        to: toAddress,
        from: wallet.address
      }

      const serializedInnerParams = Buffer.from(
        serializeParams(innerParams),
        'hex'
      ).toString('base64')

      const innerMessage = {
        to: address,
        value: '0',
        method: 7,
        params: serializedInnerParams
      }

      const serializedInnerMessage = transactionSerialize(innerMessage)

      const message = new Message({
        to: address,
        from: wallet.address,
        value: '0',
        method: 2,
        gasPrice: gasPrice.toAttoFil(),
        gasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber(),
        nonce,
        params: serializedInnerMessage
      })

      const signedMessage = await provider.wallet.sign(wallet.path, message)
      const messageObj = message.toString()
      const msgCid = await provider.sendMessage(messageObj, signedMessage)
      messageObj.cid = msgCid['/']
      messageObj.timestamp = dayjs().unix()
      messageObj.gas_used = (
        await walletProvider.estimateGas(message.encode())
      ).toAttoFil()
      messageObj.Value = new FilecoinNumber(messageObj.value, 'attofil').toFil()
      return messageObj
    }
    return null
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && validateAddressString(toAddress)) {
      setStep(3)
    } else if (step === 3) {
      setAttemptingTx(true)
      try {
        const msg = await sendMsg()
        setAttemptingTx(false)
        if (msg) {
          close()
        }
      } catch (err) {
        reportError(20, false, err.message, err.stack)
        setUncaughtError(err.message)
        setAttemptingTx(false)
        setStep(2)
      }
    }
  }

  const isSubmitBtnDisabled = () => {
    if (step === 1) return false
    if (uncaughtError) return false
    if (customizingGas) return true
    if (attemptingTx) return true
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
                    title='Change Ownership'
                    currentStep={step}
                    totalSteps={4}
                    glyphAcronym='Ch'
                  />
                  <ChangeOwnerHeaderText step={step} />
                </>
              )}
            {step === 1 && <Preface />}
            {step > 1 && (
              <CardHeader
                address={address}
                balance={balance}
                customizingGas={customizingGas}
              />
            )}
            {step > 1 && !customizingGas && (
              <>
                <Box width='100%' p={3} border={0} bg='background.screen'>
                  <Input.Address
                    label='New owner'
                    value={toAddress}
                    onChange={e => setToAddress(e.target.value)}
                    error={toAddressError}
                    disabled={step === 3}
                    onFocus={() => {
                      if (toAddressError) setToAddressError('')
                    }}
                  />
                </Box>
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
              value='0'
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

ChangeOwner.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP,
  close: PropTypes.func.isRequired
}

export default ChangeOwner
