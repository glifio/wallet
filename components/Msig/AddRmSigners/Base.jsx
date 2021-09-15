import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { Message } from '@glif/filecoin-message'
import { validateAddressString } from '@glif/filecoin-address'
import { BigNumber } from '@glif/filecoin-number'

import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { Box, Button, ButtonClose, StepHeader, Form, Card } from '../../Shared'
import { CardHeader, AddRmSignerHeaderText } from '../Shared'
import Preface from './Prefaces'
import { useWasm } from '../../../lib/WasmLoader'
import ErrorCard from '../../Wallet/Send/ErrorCard'
import ConfirmationCard from '../../Wallet/Send/ConfirmationCard'
import { LEDGER, PROPOSE, emptyGasInfo, PAGE } from '../../../constants'
import CustomizeFee from '../../Wallet/Send/CustomizeFee'
import {
  reportLedgerConfigError,
  hasLedgerError
} from '../../../utils/ledger/reportLedgerConfigError'
import reportError from '../../../utils/reportError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import { confirmMessage } from '../../../store/actions'
import { AddSignerInput, RemoveSignerInput } from './SignerInput'
import { useMsig } from '../../../MsigProvider'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { useRouter } from 'next/router'
import { navigate } from '../../../utils/urlParams'

const ManipulateSignersHOC = method => {
  if (!method) throw new Error('must pass method to ManipulateSignersHOC')
  const Base = props => {
    const { ledger, connectLedger, resetLedgerState } = useWalletProvider()
    const wallet = useWallet()
    const dispatch = useDispatch()
    const router = useRouter()
    const { serializeParams } = useWasm()
    const [step, setStep] = useState(props.signerAddress ? 3 : 1)
    const [attemptingTx, setAttemptingTx] = useState(false)
    const [signerAddress, setSignerAddress] = useState(props.signerAddress)
    const [signerAddressError, setSignerAddressError] = useState('')
    const [uncaughtError, setUncaughtError] = useState('')
    const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
    const [mPoolPushing, setMPoolPushing] = useState(false)
    const [gasError, setGasError] = useState('')
    const [gasInfo, setGasInfo] = useState(emptyGasInfo)
    const [frozen, setFrozen] = useState(false)
    const {
      Address: address,
      AvailableBalance: balance,
      Signers: signers
    } = useMsig()

    const onClose = useCallback(() => {
      navigate(router, PAGE.MSIG_OWNERS)
    }, [router])

    const onComplete = useCallback(() => {
      navigate(router, PAGE.MSIG_HISTORY)
    }, [router])

    const constructMsg = (nonce = 0) => {
      const innerParams = {
        signer: signerAddress,
        decrease: false
      }

      const serializedInnerParams = Buffer.from(
        serializeParams(innerParams),
        'hex'
      ).toString('base64')

      const outerParams = {
        to: address,
        value: '0',
        method,
        params: serializedInnerParams
      }

      const serializedOuterParams = Buffer.from(
        serializeParams(outerParams),
        'hex'
      ).toString('base64')

      const message = new Message({
        to: address,
        from: wallet.address,
        value: '0',
        method: 2,
        nonce,
        params: serializedOuterParams,
        gasFeeCap: gasInfo.gasFeeCap.toAttoFil(),
        gasLimit: new BigNumber(gasInfo.gasLimit.toAttoFil()).toNumber(),
        gasPremium: gasInfo.gasPremium.toAttoFil()
      })

      return { message, params: { ...outerParams, params: { ...innerParams } } }
    }

    const sendMsg = async () => {
      setFetchingTxDetails(true)
      const provider = await connectLedger()

      if (provider) {
        const nonce = await provider.getNonce(wallet.address)
        const { message, params } = constructMsg(nonce)
        setFetchingTxDetails(false)
        const signedMessage = await provider.wallet.sign(
          message.toSerializeableType(),
          wallet.path
        )

        const messageObj = message.toLotusType()
        setMPoolPushing(true)
        const validMsg = await provider.simulateMessage(message.toLotusType())
        if (validMsg) {
          const msgCid = await provider.sendMessage(messageObj, signedMessage)
          messageObj.cid = msgCid['/']
          messageObj.timestamp = dayjs().unix()
          messageObj.maxFee = gasInfo.estimatedTransactionFee.toAttoFil() // dont know how much was actually paid in this message yet, so we mark it as 0
          messageObj.paidFee = '0'
          messageObj.value = '0'
          // reformat the params and method for tx table
          messageObj.params = params
          messageObj.method = PROPOSE
          return messageObj
        }
        throw new Error('Filecoin message invalid. No gas or fees were spent.')
      }
      throw new Error('There was an issue when sending your message.')
    }

    const onSubmit = async e => {
      e.preventDefault()
      if (step === 1) {
        setStep(2)
      } else if (step === 2 && !validateAddressString(signerAddress)) {
        setSignerAddressError('Invalid address')
      } else if (step === 2 && validateAddressString(signerAddress)) {
        setStep(3)
      } else if (step === 3) {
        setAttemptingTx(true)
        try {
          const msg = await sendMsg()
          setAttemptingTx(false)
          if (msg) {
            dispatch(confirmMessage(toLowerCaseMsgFields(msg)))
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
      if (frozen) return true
      if (step === 1) return false
      if (step === 3 && gasError) return true
      if (uncaughtError) return false
      if (attemptingTx) return true
      if (step > 3) return true
    }

    const isBackBtnDisabled = () => {
      if (frozen) return true
      if (attemptingTx) return true
      if (fetchingTxDetails) return true
      if (mPoolPushing) return true
      return false
    }

    return (
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
                  currentStep={4}
                  totalSteps={4}
                  msig
                />
              )}
              {!attemptingTx &&
                step > 1 &&
                !hasLedgerError({ ...ledger, otherError: uncaughtError }) && (
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
                      title='Change Ownership'
                      currentStep={step}
                      totalSteps={4}
                      glyphAcronym='Ch'
                    />
                    <AddRmSignerHeaderText step={step} method={method} />
                  </Card>
                )}
              {step === 1 && <Preface method={method} />}
              <Box boxShadow={2} borderRadius={4}>
                {step > 1 && (
                  <>
                    <CardHeader
                      msig
                      address={address}
                      msigBalance={balance}
                      signerBalance={wallet.balance}
                    />
                    <Box width='100%' p={3} border={0} bg='background.screen'>
                      {method === 5 && (
                        <AddSignerInput
                          signerAddress={signerAddress}
                          setSignerAddress={setSignerAddress}
                          signerAddressError={signerAddressError}
                          setSignerAddressError={setSignerAddressError}
                          step={step}
                        />
                      )}
                      {method === 6 && (
                        <RemoveSignerInput
                          selfAddress={wallet.address}
                          signerAddress={signerAddress}
                          setSignerAddress={setSignerAddress}
                          signerAddressError={signerAddressError}
                          signers={signers}
                          setSignerAddressError={setSignerAddressError}
                          step={step}
                        />
                      )}
                    </Box>
                  </>
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
    )
  }

  Base.propTypes = {
    signerAddress: ADDRESS_PROPTYPE
  }

  Base.defaultProps = {
    signerAddress: ''
  }
  return Base
}

export default ManipulateSignersHOC
