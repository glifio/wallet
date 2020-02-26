import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'
import { validateAddressString } from '@openworklabs/filecoin-address'
import Message from '@openworklabs/filecoin-message'

import {
  Box,
  BigTitle,
  Card,
  Input,
  Stepper,
  Glyph,
  Text,
  Button,
  Label,
  Title
} from '../../Shared'

import ConfirmationCard from './ConfirmationCard'
import ErrorCard from './ErrorCard'
import { useWallet } from '../hooks'
import { useWalletProvider } from '../../../WalletProvider'
import { LEDGER } from '../../../constants'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import { confirmMessage } from '../../../store/actions'

const SendCard = styled(Card)`
  background-color: ${props => props.theme.colors.background.screen};
`

const FloatingContainer = styled(Box)`
  position: fixed;
  display: flex;
  flex-grow: 1;
  bottom: ${props => props.theme.sizes[3]}px;
  width: 100%;
  max-width: 560px;
`

const isValidForm = (
  toAddress,
  value,
  balance,
  toAddressError,
  valueError,
  otherError
) => {
  const validToAddress = validateAddressString(toAddress)
  const errorFree =
    validToAddress && !toAddressError && !valueError && !otherError
  const fieldsFilledOut = toAddress && value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThan(value)
  return !!(errorFree && fieldsFilledOut && enoughInTheBank)
}

const Send = ({ setSending }) => {
  const dispatch = useDispatch()
  const wallet = useWallet()
  const {
    ledger,
    walletProvider,
    connectLedger,
    resetLedgerState
  } = useWalletProvider()
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [value, setValue] = useState({
    fil: new FilecoinNumber('0', 'fil'),
    fiat: new BigNumber('0')
  })
  const [valueError, setValueError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [gasPrice, setGasPrice] = useState('1')
  const [gasLimit, setGasLimit] = useState('1000')
  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)

  const submitMsg = async () => {
    let provider = walletProvider
    if (wallet.type === LEDGER) {
      provider = await connectLedger()
    }
    if (provider) {
      const nonce = await provider.getNonce(wallet.address)
      const message = new Message({
        to: toAddress,
        from: wallet.address,
        value: value.fil.toAttoFil(),
        method: 0,
        gasPrice,
        gasLimit,
        nonce,
        params: ''
      })
      const serializedMessage = await message.serialize()
      const signature = await provider.wallet.sign(
        wallet.path,
        serializedMessage
      )
      const messageObj = message.encode()
      const msgCid = await provider.sendMessage(messageObj, signature)
      messageObj.cid = msgCid['/']
      setAttemptingTx(false)
      return messageObj
    }
  }

  const onSubmit = async e => {
    e.preventDefault()
    setAttemptingTx(true)
    if (
      !isValidForm(
        toAddress,
        value.fil,
        wallet.balance,
        toAddressError,
        valueError,
        uncaughtError
      )
    ) {
      setUncaughtError('Invalid form!')
    }
    if (step === 1 && wallet.type !== LEDGER) {
      setStep(2)
    } else {
      try {
        setStep(2)
        const message = await submitMsg()
        dispatch(confirmMessage(toLowerCaseMsgFields(message)))
        setValue({
          fil: new FilecoinNumber('0', 'fil'),
          fiat: new BigNumber('0')
        })
        setToAddress('')
        setSending(false)
      } catch (err) {
        setUncaughtError(err.message)
      }
    }
  }

  const hasError = () =>
    !!(
      attemptingTx &&
      (uncaughtError ||
        (wallet.type === LEDGER &&
          reportLedgerConfigError(
            ledger.connectedFailure,
            ledger.locked,
            ledger.filecoinAppNotOpen,
            ledger.replug,
            ledger.busy
          )))
    )

  const ledgerError = () =>
    wallet.type === LEDGER &&
    reportLedgerConfigError(
      ledger.connectedFailure,
      ledger.locked,
      ledger.filecoinAppNotOpen,
      ledger.replug,
      ledger.busy
    )

  return (
    <>
      <Box position='relative'>
        {hasError() && (
          <ErrorCard
            error={ledgerError() || uncaughtError}
            reset={() => {
              resetLedgerState()
              setStep(1)
            }}
          />
        )}
        {step === 2 && (
          <ConfirmationCard
            walletType={wallet.type}
            value={value}
            toAddress={toAddress}
          />
        )}
        <form onSubmit={onSubmit}>
          <SendCard
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            border='none'
            width='auto'
            my={2}
            mx={4}
          >
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box display='flex' alignItems='center'>
                <Box
                  display='flex'
                  flexDirection='column'
                  justifyContent='center'
                  width={6}
                  height={6}
                  backgroundColor='core.primary'
                >
                  <Glyph
                    acronym='To'
                    color='background.screen'
                    borderColor='core.primary'
                    backgroundColor='core.primary'
                  />
                </Box>
                <Text color='core.primary' ml={2}>
                  Sending Filecoin
                </Text>
              </Box>
              <Stepper
                textColor='core.primary'
                completedDotColor='core.primary'
                incompletedDotColor='core.silver'
                step={1}
                totalSteps={2}
              >
                Step 1
              </Stepper>
            </Box>
            <Box mt={3}>
              <Input.Address
                name='recipient'
                onChange={e => setToAddress(e.target.value)}
                value={toAddress}
                label='Recipient'
                placeholder='t1...'
                error={toAddressError}
                setError={setToAddressError}
              />
              <Input.Funds
                name='amount'
                label='Amount'
                onAmountChange={setValue}
                balance={wallet.balance}
                error={valueError}
                setError={setValueError}
                gasLimit={gasLimit}
              />
              <Box display='flex' flexDirection='column'>
                <Input.Text
                  onChange={() => {}}
                  label='Transfer Fee'
                  value='< 0.1FIL'
                  backgroundColor='background.screen'
                  disabled
                />
                <Input.Text
                  label='Completes In'
                  value='Approx. 17 Seconds'
                  onChange={() => {}}
                  backgroundColor='background.screen'
                  disabled
                />
              </Box>
              <Box
                display='flex'
                flexDirection='row'
                alignItems='center'
                justifyContent='space-between'
                mt={3}
              >
                <Label>Total</Label>
                <Box display='flex' flexDirection='column'>
                  <BigTitle color='core.primary'>
                    {value.fil.toFil()} FIL
                  </BigTitle>
                  <Title color='core.darkgray'>
                    {value.fiat.toString()} USD
                  </Title>
                </Box>
              </Box>
            </Box>
          </SendCard>
          <FloatingContainer
            bottom='8px'
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            boxShadow={1}
            backgroundColor='core.white'
            border={1}
            borderColor='core.silver'
            borderRadius={2}
            p={3}
          >
            <Button title='Cancel' buttonStyle='secondary' onClick={() => {}} />
            {step === 2 && wallet.type === LEDGER ? (
              <Text>Confirm on your Ledger Device.</Text>
            ) : (
              <Button
                disabled={
                  !!(
                    hasError() ||
                    !isValidForm(
                      toAddress,
                      value.fil,
                      wallet.balance,
                      toAddressError,
                      valueError
                    )
                  )
                }
                type='submit'
                title='Next'
                buttonStyle='primary'
                onClick={() => {}}
              />
            )}
          </FloatingContainer>
        </form>
      </Box>
    </>
  )
}

Send.propTypes = {
  setSending: PropTypes.func.isRequired
}

export default Send
