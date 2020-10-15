import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { FilecoinNumber } from '@glif/filecoin-number'
import { Message } from '@glif/filecoin-message'
import { validateAddressString } from '@glif/filecoin-address'

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
  InlineBox,
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
import { LEDGER, PROPOSE } from '../../../constants'
import {
  reportLedgerConfigError,
  hasLedgerError
} from '../../../utils/ledger/reportLedgerConfigError'
import reportError from '../../../utils/reportError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import { confirmMessage } from '../../../store/actions'

const ChangeOwner = ({ address, balance, close }) => {
  const { ledger, connectLedger, resetLedgerState } = useWalletProvider()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const { serializeParams } = useWasm()
  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
  const [mPoolPushing, setMPoolPushing] = useState(false)

  const sendMsg = async () => {
    setFetchingTxDetails(true)
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
      setFetchingTxDetails(false)
      const signedMessage = await provider.wallet.sign(
        msgWithGas.toSerializeableType(),
        wallet.path
      )

      const messageObj = msgWithGas.toLotusType()
      setMPoolPushing(true)
      const msgCid = await provider.sendMessage(messageObj, signedMessage)
      messageObj.cid = msgCid['/']
      messageObj.timestamp = dayjs().unix()
      const maxFee = await provider.gasEstimateMaxFee(msgWithGas.toLotusType())
      messageObj.maxFee = maxFee.toAttoFil()
      // dont know how much was actually paid in this message yet, so we mark it as 0
      messageObj.paidFee = '0'
      messageObj.value = new FilecoinNumber(messageObj.Value, 'attofil').toFil()
      // reformat the params and method for tx table
      messageObj.params = { ...innerMessage, params: innerParams }
      messageObj.method = PROPOSE
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
          dispatch(confirmMessage(toLowerCaseMsgFields(msg)))
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
        setStep(2)
      } finally {
        setFetchingTxDetails(false)
        setAttemptingTx(false)
        setMPoolPushing(false)
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
      <Box display='flex' flexDirection='column' width='100%'>
        <ButtonClose
          role='button'
          type='button'
          justifySelf='flex-end'
          marginLeft='auto'
          onClick={() => {
            setAttemptingTx(false)
            setUncaughtError('')
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
            flexDirection='column'
            justifyContent='flex-start'
            flexGrow='1'
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
                  loading={fetchingTxDetails || mPoolPushing}
                  walletType={LEDGER}
                  currentStep={4}
                  totalSteps={4}
                  msig
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
              <Box boxShadow={2} borderRadius={4}>
                {step > 1 && (
                  <CardHeader
                    msig
                    address={address}
                    msigBalance={balance}
                    signerBalance={wallet.balance}
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
                          <Box display='flex' alignItems='flex-start'>
                            <Text margin={0} color='core.darkgray'>
                              Paid via{' '}
                            </Text>
                            <InlineBox ml={1} mr={2}>
                              <IconLedger size={4} />
                            </InlineBox>
                            <Text margin={0} color='core.darkgray'>
                              {makeFriendlyBalance(wallet.balance, 6, true)} FIL
                            </Text>
                          </Box>
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
            </Box>
            <Box
              display='flex'
              flex='1'
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
