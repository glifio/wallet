import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { Message } from '@glif/filecoin-message'
import { validateAddressString } from '@glif/filecoin-address'
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number'
import LotusRPCEngine from '@glif/filecoin-rpc-client'

import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import {
  Box,
  Button,
  ButtonClose,
  StepHeader,
  Input,
  Text,
  Form,
  Card
} from '../../Shared'
import { CardHeader, CreateMultisigHeaderText } from '../Shared'
import { useWasm } from '../../../lib/WasmLoader'
import ErrorCard from '../../Wallet/Send.js/ErrorCard'
import ConfirmationCard from '../../Wallet/Send.js/ConfirmationCard'
import { LEDGER, emptyGasInfo, EXEC } from '../../../constants'
import CustomizeFee from '../../Wallet/Send.js/CustomizeFee'
import {
  reportLedgerConfigError,
  hasLedgerError
} from '../../../utils/ledger/reportLedgerConfigError'
import reportError from '../../../utils/reportError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import { confirmMessage } from '../../../store/actions'

const isValidAmount = (value, balance, errorFromForms) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThanOrEqualTo(value)
  return valueFieldFilledOut && enoughInTheBank && !errorFromForms
}

const Create = () => {
  const { ledger, connectLedger, resetLedgerState } = useWalletProvider()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const wasm = useWasm()
  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [signerAddresses, setSignerAddresses] = useState([wallet.address])
  const [signerAddressError, setSignerAddressError] = useState('')
  const [value, setValue] = useState(new FilecoinNumber('0', 'fil'))
  const [valueError, setValueError] = useState('')
  const [vest, setVest] = useState(0)
  const [startEpoch, setStartEpoch] = useState(0)
  const [uncaughtError, setUncaughtError] = useState('')
  const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
  const [mPoolPushing, setMPoolPushing] = useState(false)
  const [pageChanging, setPageChanging] = useState(false)
  const [gasError, setGasError] = useState('')
  const [gasInfo, setGasInfo] = useState(emptyGasInfo)
  const [frozen, setFrozen] = useState(false)
  const router = useRouter()

  const close = () => router.back()

  const constructMsg = (nonce = 0, epoch = startEpoch) => {
    const tx = wasm.createMultisig(
      wallet.address,
      [...signerAddresses],
      value.toAttoFil(),
      1,
      nonce,
      vest.toString(),
      epoch.toString()
    )

    const message = new Message({
      to: 't01',
      from: wallet.address,
      value: value.toAttoFil(),
      method: 2,
      nonce,
      params: tx.params,
      gasFeeCap: gasInfo.gasFeeCap.toAttoFil(),
      gasLimit: new BigNumber(gasInfo.gasLimit.toAttoFil()).toNumber(),
      gasPremium: gasInfo.gasPremium.toAttoFil()
    })

    return {
      message,
      params: {
        num_approvals_threshold: 1,
        signers: [...signerAddresses],
        start_epoch: startEpoch.toString(),
        unlock_duration: vest.toString()
      }
    }
  }

  const sendMsg = async () => {
    setFetchingTxDetails(true)
    const provider = await connectLedger()

    if (provider) {
      const nonce = await provider.getNonce(wallet.address)
      const { message, params } = constructMsg(nonce, startEpoch)
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
        // reformat the params and method for tx table
        messageObj.params = params
        messageObj.method = EXEC
        return messageObj
      }
      throw new Error('Filecoin message invalid. No gas or fees were spent.')
    }
    throw new Error('There was an issue when sending your message.')
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (step === 1 && !signerAddresses.every(validateAddressString)) {
      setSignerAddressError('Invalid to address')
    } else if (step === 1 && signerAddresses.every(validateAddressString)) {
      setStep(2)
    } else if (step === 2 && !valueError) {
      setStep(3)
    } else if (step === 3) {
      if (vest > 0) {
        const lCli = new LotusRPCEngine({
          apiAddress: process.env.LOTUS_NODE_JSONRPC
        })
        const { Height } = await lCli.request('ChainHead')
        setStartEpoch(Height)
        setStep(4)
      } else {
        setStep(5)
      }
    } else if (step === 4 && vest > 0) {
      setStep(5)
    } else if (step === 5) {
      setAttemptingTx(true)
      try {
        const msg = await sendMsg()
        setAttemptingTx(false)
        if (msg) {
          setPageChanging(true)
          dispatch(confirmMessage(toLowerCaseMsgFields(msg)))
          const params = new URLSearchParams(router.query)
          router.push(`/vault/create/confirm?${params.toString()}`)
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
            `${wallet.address} is not a signer of the multisig wallet.`
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
    if (uncaughtError) return true
    if (attemptingTx) return true
    if (mPoolPushing) return true
    if (pageChanging) return true
    if (step === 1 && !signerAddresses[0]) return true
    if (step === 1 && signerAddresses.length < 1) return true
    if (step === 2 && !isValidAmount(value, wallet.balance, valueError))
      return true
    if (step === 3 && gasError) return true
    if (step > 5) return true
  }

  const isBackBtnDisabled = () => {
    if (frozen) return true
    if (attemptingTx) return true
    if (fetchingTxDetails) return true
    if (mPoolPushing) return true
    if (pageChanging) return true
    return false
  }

  const onSignerAddressChange = (val, idx) => {
    return setSignerAddresses(addresses => {
      const addressesCopy = [...addresses]
      if (addressesCopy.includes(val)) {
        setSignerAddressError('Signers must be unique.')
        return addressesCopy
      }
      if (idx > addresses.length) {
        addressesCopy.push('')
      } else {
        addressesCopy.splice(idx, 1, val)
      }
      return addressesCopy
    })
  }

  const onSignerAddressRm = idx => {
    setSignerAddressError('')
    return setSignerAddresses(addresses => {
      const addressesCopy = [...addresses]
      addressesCopy.splice(idx, 1)
      return addressesCopy
    })
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
                    title='Create Multisig Wallet'
                    currentStep={step}
                    totalSteps={5}
                    glyphAcronym='Cr'
                  />
                  <CreateMultisigHeaderText step={step} />
                </Card>
              )}
            <Box boxShadow={2} borderRadius={4}>
              <>
                <CardHeader
                  address={wallet.address}
                  signerBalance={wallet.balance}
                />
                <Box
                  display='flex'
                  width='100%'
                  alignItems='center'
                  pt={3}
                  bg='background.screen'
                >
                  <Text py={0} pl={3} my={0} mx={0}>
                    No.
                  </Text>
                  <Text pl={5} mx={1} my={0}>
                    Signer Address
                  </Text>
                </Box>
                <Box width='100%' p={3} border={0} bg='background.screen'>
                  {/* eslint-disable react/no-array-index-key */}
                  {signerAddresses.map((a, i) => {
                    const disabled =
                      step > 1 || !(i === signerAddresses.length - 1)
                    return (
                      <Box
                        // using index as key here is OK since the signers position IS unique in this case
                        key={i}
                        display='flex'
                        flexDirection='row'
                        mb={2}
                      >
                        <Input.Address
                          label={`${i + 1}`}
                          value={a}
                          onChange={e =>
                            onSignerAddressChange(e.target.value, i)
                          }
                          error={
                            signerAddresses.length - 1 === i
                              ? signerAddressError
                              : ''
                          }
                          disabled={
                            // disable this input when its already been added
                            step > 1 || !(i === signerAddresses.length - 1)
                          }
                          onFocus={() => {
                            if (signerAddressError) setSignerAddressError('')
                          }}
                        />
                        <Box display='flex' alignItems='center' width={6}>
                          {i > 0 && step === 1 && (
                            <ButtonClose
                              onClick={() => onSignerAddressRm(i)}
                              disabled={disabled}
                              bg='card.error.background'
                              borderColor='card.error.background'
                              ml={2}
                            />
                          )}
                        </Box>
                      </Box>
                    )
                  })}
                  {step === 1 && (
                    <Button
                      title='Add Another Signer'
                      variant='secondary'
                      width='100%'
                      mt={3}
                      onClick={() => {
                        const lastSigner =
                          signerAddresses[signerAddresses.length - 1]
                        if (validateAddressString(lastSigner)) {
                          onSignerAddressChange('', signerAddresses.length)
                        } else {
                          setSignerAddressError('Invalid signer address')
                        }
                      }}
                    />
                  )}
                </Box>
                {step > 1 && (
                  <Box width='100%' p={3} border={0} bg='background.screen'>
                    <Input.Funds
                      name='amount'
                      label='Amount'
                      amount={value.toAttoFil()}
                      onAmountChange={setValue}
                      balance={wallet.balance}
                      error={valueError}
                      setError={setValueError}
                      disabled={step > 2}
                    />
                  </Box>
                )}
                {step > 2 && (
                  <Box width='100%' p={3} border={0} bg='background.screen'>
                    <Input.Number
                      name='vest'
                      label='Vest (# blocks)'
                      value={vest > 0 ? vest.toString() : ''}
                      placeholder='0'
                      onChange={e => setVest(e.target.value)}
                      disabled={step > 3}
                    />
                  </Box>
                )}
                {step > 3 && vest > 0 && (
                  <Box width='100%' p={3} border={0} bg='background.screen'>
                    <Input.Number
                      name='epochs'
                      label='Start epoch (block #)'
                      value={startEpoch > 0 ? startEpoch.toString() : ''}
                      placeholder={startEpoch.toString()}
                      onChange={e => setStartEpoch(e.target.value)}
                      disabled={step > 4}
                    />
                  </Box>
                )}
                {step > 4 && (
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
                      message={constructMsg(
                        0,
                        startEpoch
                      ).message.toLotusType()}
                      gasInfo={gasInfo}
                      setGasInfo={setGasInfo}
                      setFrozen={setFrozen}
                      setError={setGasError}
                      error={gasError}
                      feeMustBeLessThanThisAmount={wallet.balance}
                    />
                  </Box>
                )}
              </>
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
                  close()
                }
                if (step === 5 && vest === 0) {
                  setStep(3)
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
export default Create
