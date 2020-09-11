import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
  Form
} from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import { CardHeader, ChangeOwnerHeaderText } from '../Shared'
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
  const { ledger, connectLedger, resetLedgerState } = useWalletProvider()
  const wallet = useWallet()
  const { serializeParams } = useWasm()

  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')

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

      const serializedInnerMessage = Buffer.from(
        serializeParams(innerMessage),
        'hex'
      )

      const messageForSigning = new Message({
        to: address,
        from: wallet.address,
        value: '0',
        method: 2,
        nonce,
        params: serializedInnerMessage.toString('base64')
      })

      const msgWithGas = await provider.gasEstimateMessageGas(
        messageForSigning.toLotusType()
      )

      const signedMessage = await provider.wallet.sign(
        msgWithGas.toSerializeableType(),
        wallet.path
      )

      const messageObj = msgWithGas.toLotusType()
      const msgCid = await provider.sendMessage(messageObj, signedMessage)
      messageObj.cid = msgCid['/']
      messageObj.timestamp = dayjs().unix()
      const maxFee = await provider.gasEstimateMaxFee(msgWithGas.toLotusType())
      messageObj.maxFee = maxFee.toAttoFil()
      // dont know how much was actually paid in this message yet, so we mark it as 0
      messageObj.paidFee = '0'
      messageObj.value = new FilecoinNumber(messageObj.Value, 'attofil').toFil()
      return messageObj
    }
    return null
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && !validateAddressString(toAddress)) {
      setToAddressError('Invalid to address')
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
          reportError(20, false, err.message, err.stack)
          setUncaughtError(err.message || err)
        }
        setAttemptingTx(false)
        setStep(2)
      }
    }
  }

  const isSubmitBtnDisabled = () => {
    if (step === 1) return false
    if (uncaughtError) return false
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
      <Form onSubmit={onSubmit}>
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
                customizingGas={false}
              />
            )}
            {step > 1 && (
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
                      <Text ml={2} color='core.primary'>
                        {'< 0.0001 FIL'}
                      </Text>
                    </Box>
                  </Box>
                )}
              </>
            )}
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

ChangeOwner.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP,
  close: PropTypes.func.isRequired
}

export default ChangeOwner
