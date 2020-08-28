import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { border, layout, space, flexbox, position } from 'styled-system'
import { useDispatch } from 'react-redux'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'
import { validateAddressString } from '@openworklabs/filecoin-address'
import { Message } from '@openworklabs/filecoin-message'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import noop from '../../../utils/noop'

import {
  Box,
  Input,
  Glyph,
  Text,
  Num,
  Button,
  ButtonClose,
  FloatingContainer,
  Title as Total,
  ContentContainer as SendContainer,
  Stepper
} from '../../Shared'
import ConfirmationCard from './ConfirmationCard'
import ErrorCard from './ErrorCard'
import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { LEDGER } from '../../../constants'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import { confirmMessage } from '../../../store/actions'
import { useConverter } from '../../../lib/Converter'
import reportError from '../../../utils/reportError'

const SendCardForm = styled.form.attrs(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  py: 3,
  border: 1,
  borderRadius: 2,
  borderColor: 'silver',
  spellcheck: false
}))`
  background-color: ${props => props.theme.colors.background.screen};
  /* box-shadow: ${props => props.theme.shadows[2]}; */
  ${position}
  ${border}
  ${space}
  ${layout}
  ${flexbox}
`

// this is a bit confusing, sometimes the form can report errors, so we check those here too
const isValidAmount = (value, balance, errorFromForms) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThan(value)
  return valueFieldFilledOut && enoughInTheBank && !errorFromForms
}
const isValidAddress = (address, errorFromForms) => {
  const validToAddress = validateAddressString(address)
  return !errorFromForms && validToAddress
}

const isValidForm = (
  toAddress,
  value,
  balance,
  toAddressError,
  valueError,
  otherError
) => {
  const validToAddress = isValidAddress(toAddress, toAddressError)
  const validAmount = isValidAmount(value, balance, valueError)
  return validToAddress && validAmount && !otherError
}

const Send = ({ close }) => {
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
  const [value, setValue] = useState(new FilecoinNumber('0', 'fil'))
  const [valueError, setValueError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [estimatedTransactionFee, setEstimatedTransactionFee] = useState(
    new FilecoinNumber('122222', 'attofil')
  )

  const [step, setStep] = useState(1)
  const [attemptingTx, setAttemptingTx] = useState(false)

  const submitMsg = async () => {
    let provider = walletProvider
    // attempt to establish a new connection with the ledger device if the user selected ledger
    if (wallet.type === LEDGER) {
      provider = await connectLedger()
    }

    if (provider) {
      const nonce = await provider.getNonce(wallet.address)
      const message = new Message({
        to: toAddress,
        from: wallet.address,
        value: new BigNumber(value.toAttoFil()).toFixed(0, 1),
        method: 0,
        nonce,
        params: ''
      })

      const msgWithGas = await provider.gasEstimateMessageGas(
        message.toLotusType()
      )

      const signedMessage = await provider.wallet.sign(
        msgWithGas.toSerializeableType(),
        wallet.path
      )

      const messageObj = msgWithGas.toLotusType()
      const msgCid = await provider.sendMessage(
        msgWithGas.toLotusType(),
        signedMessage
      )
      messageObj.cid = msgCid['/']
      messageObj.timestamp = dayjs().unix()
      const maxFee = await provider.gasEstimateMaxFee(msgWithGas.toLotusType())
      messageObj.maxFee = maxFee.toAttoFil()
      // dont know how much was actually paid in this message yet, so we mark it as 0
      messageObj.paidFee = '0'
      messageObj.value = new FilecoinNumber(messageObj.Value, 'attofil').toFil()
      return messageObj
    }
  }

  const sendMsg = async () => {
    const message = await submitMsg()
    if (message) {
      dispatch(confirmMessage(toLowerCaseMsgFields(message)))
      setValue(new FilecoinNumber('0', 'fil'))
      setAttemptingTx(false)
      close()
    }
  }

  const onSubmit = async e => {
    e.preventDefault()
    setAttemptingTx(true)
    if (
      !isValidForm(
        toAddress,
        value,
        wallet.balance,
        toAddressError,
        valueError,
        uncaughtError
      )
    ) {
      if (!isValidAddress(toAddress, toAddressError))
        setToAddressError('Invalid address.')
      if (!isValidAmount(value, wallet.balance, valueError))
        setValueError(
          'Please enter a valid amount that is less than your Filecoin balance.'
        )
      return
    }

    if (wallet.type === LEDGER) {
      setStep(2)
      try {
        await sendMsg()
      } catch (err) {
        reportError(9, false, err.message, err.stack)
        setUncaughtError(err.message)
        setStep(1)
      }
    } else {
      // handle all other wallet types, this is easier to read than pleasing the linter
      /* eslint-disable no-lonely-if */
      if (step === 1) {
        setStep(2)
      } else {
        setStep(3)
        try {
          await sendMsg()
        } catch (err) {
          reportError(10, false, err.message, err.stack)
          setUncaughtError(err.message || err)
          setStep(2)
        }
      }
    }
  }

  const hasError = () =>
    !!(
      attemptingTx &&
      (uncaughtError ||
        (wallet.type === LEDGER && reportLedgerConfigError(ledger)))
    )

  const ledgerError = () =>
    wallet.type === LEDGER && reportLedgerConfigError(ledger)

  const { converter, converterError } = useConverter()

  return (
    <>
      <SendContainer>
        {hasError() && (
          <ErrorCard
            error={ledgerError() || uncaughtError}
            reset={() => {
              setAttemptingTx(false)
              setUncaughtError('')
              resetLedgerState()
              setStep(1)
            }}
          />
        )}
        {(step === 2 || step === 3) && !hasError() && (
          <ConfirmationCard walletType={wallet.type} />
        )}
        <SendCardForm onSubmit={onSubmit} autoComplete='off'>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            px={3}
          >
            <Box display='flex' alignItems='center'>
              <Glyph
                acronym='To'
                color='background.screen'
                borderColor='core.primary'
                backgroundColor='core.primary'
              />
              <Text color='core.primary' ml={2}>
                Sending Filecoin
              </Text>
            </Box>
            <Box display='flex' alignItems='center'>
              <Stepper
                textColor='core.primary'
                completedDotColor='core.primary'
                incompletedDotColor='core.silver'
                step={1}
                totalSteps={2}
                mr={2}
              />
              <ButtonClose
                role='button'
                type='button'
                onClick={() => {
                  setAttemptingTx(false)
                  setUncaughtError('')
                  resetLedgerState()
                  close()
                }}
              />
            </Box>
          </Box>
          <Box mt={5}>
            <Box px={3}>
              <Input.Address
                name='recipient'
                onChange={e => setToAddress(e.target.value)}
                value={toAddress}
                label='Recipient'
                placeholder='t1...'
                error={toAddressError}
                setError={setToAddressError}
                disabled={step === 2 && !hasError()}
                valid={validateAddressString(toAddress)}
              />
              <Input.Funds
                name='amount'
                label='Amount'
                amount={value.toAttoFil()}
                onAmountChange={setValue}
                balance={wallet.balance}
                error={valueError}
                setError={setValueError}
                estimatedTransactionFee={estimatedTransactionFee}
                disabled={step === 2 && !hasError()}
                valid={isValidAmount(value, wallet.balance, valueError)}
              />
              <Box position='relative' width='100%'>
                <Input.Text
                  onChange={noop}
                  denom='FIL'
                  label='Transaction Fee'
                  value='< 0.0001'
                  disabled
                />
              </Box>
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              alignItems='flex-start'
              justifyContent='space-between'
              mt={5}
              mx={1}
              px={3}
            >
              <Total fontSize={4} alignSelf='flex-start'>
                Total
              </Total>
              <Box
                display='flex'
                flexDirection='column'
                textAlign='right'
                pl={4}
              >
                <Num
                  size='l'
                  css={`
                    word-wrap: break-word;
                  `}
                  color='core.primary'
                >
                  {value.isGreaterThan(0)
                    ? `${value.plus(estimatedTransactionFee).toString()}`
                    : '0'}{' '}
                  FIL
                </Num>
                <Num size='m' color='core.darkgray'>
                  {!converterError && value.isGreaterThan(0)
                    ? `${makeFriendlyBalance(
                        converter.fromFIL(value.plus(estimatedTransactionFee)),
                        2
                      )}`
                    : '0'}{' '}
                  USD
                </Num>
              </Box>
            </Box>
          </Box>
          <FloatingContainer>
            {step === 2 && wallet.type === LEDGER && !hasError() ? (
              <Text width='100%' textAlign='center' px={4}>
                Confirm or reject the transaction on your Ledger Device.
              </Text>
            ) : (
              <>
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
                  css={`
                    /* 'css' operation is used here to override its inherited border-radius property */
                    border-radius: 0px;
                  `}
                />
                <Button
                  border={0}
                  borderRadius={0}
                  type='submit'
                  title={step === 1 ? 'Send' : 'Confirm'}
                  variant='primary'
                  onClick={noop}
                  css={`
                    /* 'css' operation is used here to override its inherited border-radius property */
                    border-radius: 0px;
                  `}
                />
              </>
            )}
          </FloatingContainer>
        </SendCardForm>
      </SendContainer>
    </>
  )
}

Send.propTypes = {
  close: PropTypes.func.isRequired
}

export default Send
