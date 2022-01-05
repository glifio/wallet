import React, { useCallback, useState } from 'react'
import { BigNumber } from '@glif/filecoin-number'
import dayjs from 'dayjs'
import { Message } from '@glif/filecoin-message'
import { validateAddressString } from '@glif/filecoin-address'
import {
  Form,
  Card,
  StyledATag,
  Box,
  Button,
  ButtonClose,
  Label,
  CopyText,
  Warning,
  StepHeader,
  Input
} from '@glif/react-components'
import {
  useWalletProvider,
  useWallet,
  reportLedgerConfigError,
  hasLedgerError
} from '@glif/wallet-provider-react'
import { useRouter } from 'next/router'

import truncateAddress from '../../../utils/truncateAddress'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { CardHeader, ChangeSignerHeaderText } from '../Shared'
import { useWasm } from '../../../lib/WasmLoader'
import ErrorCard from '../../Wallet/Send/ErrorCard'
import ConfirmationCard from '../../Wallet/Send/ConfirmationCard'
import {
  LEDGER,
  PROPOSE,
  emptyGasInfo,
  PAGE,
  MSIG_METHOD
} from '../../../constants'
import CustomizeFee from '../../Wallet/Send/CustomizeFee'
import reportError from '../../../utils/reportError'
import { useMsig } from '../../../MsigProvider'
import { navigate } from '../../../utils/urlParams'

const ChangeOwner = ({ oldSignerAddress }) => {
  const { ledger, connectLedger, resetLedgerState } = useWalletProvider()
  const wallet = useWallet()
  const router = useRouter()
  // @ts-expect-error
  const { serializeParams } = useWasm()
  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)
  const [newSignerAddress, setNewSignerAddress] = useState('')
  const [newSignerAddressError, setNewSignerAddressError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [fetchingTxDetails, setFetchingTxDetails] = useState(false)
  const [mPoolPushing, setMPoolPushing] = useState(false)
  const [gasError, setGasError] = useState('')
  const [gasInfo, setGasInfo] = useState(emptyGasInfo)
  const [frozen, setFrozen] = useState(false)
  const { Address: address, AvailableBalance: balance } = useMsig()

  const onClose = useCallback(() => {
    navigate(router, { pageUrl: PAGE.MSIG_ADMIN })
  }, [router])

  const onComplete = useCallback(() => {
    navigate(router, { pageUrl: PAGE.MSIG_HISTORY })
  }, [router])

  const constructMsg = (nonce = 0) => {
    const innerParams = {
      to: newSignerAddress,
      from: oldSignerAddress
    }

    const serializedInnerParams = Buffer.from(
      serializeParams(innerParams),
      'hex'
    ).toString('base64')

    const outerParams = {
      to: address,
      value: '0',
      method: MSIG_METHOD.SWAP_SIGNER,
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
      method: MSIG_METHOD.PROPOSE,
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
      const messageObj = message.toLotusType()
      setFetchingTxDetails(false)
      const signedMessage = await provider.wallet.sign(
        wallet.address,
        messageObj
      )

      setMPoolPushing(true)
      const validMsg = await provider.simulateMessage(messageObj)
      if (validMsg) {
        const msgCid = await provider.sendMessage(signedMessage)
        // @ts-expect-error
        const messageForTxHistory: LotusMessage & {
          cid: string
          timestamp: number
          maxFee: string
          paidFee: string
          value: string
          method: string
          params: string | object
        } = { ...messageObj }
        messageForTxHistory.cid = msgCid['/']
        messageForTxHistory.timestamp = dayjs().unix()
        messageForTxHistory.maxFee = gasInfo.estimatedTransactionFee.toAttoFil() // dont know how much was actually paid in this message yet, so we mark it as 0
        messageForTxHistory.paidFee = '0'
        messageForTxHistory.value = '0'
        // reformat the params and method for tx table
        messageForTxHistory.params = params
        messageForTxHistory.method = PROPOSE
        return messageForTxHistory
      }
      throw new Error('Filecoin message invalid. No gas or fees were spent.')
    }
    throw new Error('There was an issue when sending your message.')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && !validateAddressString(newSignerAddress)) {
      setNewSignerAddressError('Invalid to address')
    } else if (step === 2 && validateAddressString(newSignerAddress)) {
      setStep(3)
    } else if (step === 3) {
      setAttemptingTx(true)
      try {
        const msg = await sendMsg()
        setAttemptingTx(false)
        if (msg) {
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
                  <ChangeSignerHeaderText step={step} />
                </Card>
              )}
            {step === 1 && (
              <Warning
                title='Warning'
                description={[
                  "You're changing a signer of your multisig account to a new Filecoin address.",
                  'Make sure you or someone you trust owns the private key to this new Filecoin address.',
                  'If you or anyone else does not own this address, you could lose access to your funds permanently. There is no way to resolve this.'
                ]}
                linkDisplay="Why isn't it secure?"
                linkhref='https://coinsutra.com/security-risks-bitcoin-wallets/'
              />
            )}
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
                    <Box
                      display='flex'
                      flexDirection='row'
                      alignItems='center'
                      justifyContent='space-between'
                      py={3}
                    >
                      <Label color='core.nearblack' pl='0'>
                        Old signer
                      </Label>
                      <Box
                        display='flex'
                        flexDirection='row'
                        alignItems='center'
                      >
                        <StyledATag
                          target='_blank'
                          href={`https://filfox.info/en/address/${oldSignerAddress}`}
                        >{`${truncateAddress(oldSignerAddress)}`}</StyledATag>
                        <CopyText text={oldSignerAddress} hideCopyText />
                      </Box>
                    </Box>
                    <Box mt={2}>
                      <Input.Address
                        label='New signer'
                        value={newSignerAddress}
                        onChange={(e) => setNewSignerAddress(e.target.value)}
                        error={newSignerAddressError}
                        disabled={step === 3}
                        onFocus={() => {
                          if (newSignerAddressError)
                            setNewSignerAddressError('')
                        }}
                      />
                    </Box>
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

ChangeOwner.propTypes = {
  oldSignerAddress: ADDRESS_PROPTYPE
}

export default ChangeOwner
