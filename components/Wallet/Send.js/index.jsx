import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { border, layout, space, flexbox, position } from 'styled-system'
import { useDispatch } from 'react-redux'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'
import { validateAddressString } from '@openworklabs/filecoin-address'
import Message from '@openworklabs/filecoin-message'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

import {
  Box,
  BigTitle,
  Input,
  Stepper,
  Glyph,
  Text,
  Button,
  Title,
  FloatingContainer,
  Title as Total,
  ContentContainer as SendContainer
} from '../../Shared'
import { ButtonClose } from '../../Shared/IconButtons'
import ConfirmationCard from './ConfirmationCard'
import GasCustomization from './GasCustomization'
import ErrorCard from './ErrorCard'
import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { LEDGER } from '../../../constants'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'
import toLowerCaseMsgFields from '../../../utils/toLowerCaseMsgFields'
import { confirmMessage } from '../../../store/actions'

const SendCardForm = styled.form.attrs(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  p: 3,
  border: 1,
  borderRadius: 2,
  borderColor: 'silver'
}))`
  background-color: ${props => props.theme.colors.background.screen};
  /* box-shadow: ${props => props.theme.shadows[2]}; */
  ${position}
  ${border}
  ${space}
  ${layout}
  ${flexbox}
`

const isValidAmount = (value, balance, error) => {
  const valueFieldFilledOut = value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThan(value)
  return valueFieldFilledOut && enoughInTheBank && !error
}

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
  const validAmount = isValidAmount(value, balance)
  return !!(errorFree && validAmount)
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
  const [value, setValue] = useState({
    fil: new FilecoinNumber('0', 'fil'),
    fiat: new BigNumber('0')
  })
  const [valueError, setValueError] = useState('')
  const [uncaughtError, setUncaughtError] = useState('')
  const [gasPrice, setGasPrice] = useState(new FilecoinNumber('1', 'attofil'))
  const [gasLimit, setGasLimit] = useState(
    new FilecoinNumber('1000', 'attofil')
  )
  const [step, setStep] = useState(1)
  const [customizingGas, setCustomizingGas] = useState(false)

  const [attemptingTx, setAttemptingTx] = useState(false)

  const estimateGas = async gp => {
    // create a fake message
    const message = new Message({
      to: wallet.address,
      from: wallet.address,
      value: value.fil.toAttoFil(),
      method: 0,
      gasPrice: gp.toAttoFil(),
      gasLimit: '100000000',
      nonce: 0,
      params: ''
    })

    return walletProvider.estimateGas(message.encode())
  }

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
        value: new BigNumber(value.fil.toAttoFil()).toFixed(0, 1),
        method: 0,
        gasPrice: gasPrice.toAttoFil(),
        gasLimit: gasLimit.toAttoFil(),
        nonce,
        params: ''
      })

      const signature = await provider.wallet.sign(wallet.path, message)
      const messageObj = message.encode()
      const msgCid = await provider.sendMessage(messageObj, signature)
      messageObj.cid = msgCid['/']
      messageObj.timestamp = dayjs().unix()
      messageObj.gas_used = (
        await walletProvider.estimateGas(messageObj)
      ).toAttoFil()
      messageObj.Value = new FilecoinNumber(messageObj.Value, 'attofil').toFil()
      return messageObj
    }
  }

  const sendMsg = async () => {
    const message = await submitMsg()
    if (message) {
      dispatch(confirmMessage(toLowerCaseMsgFields(message)))
      setValue({
        fil: new FilecoinNumber('0', 'fil'),
        fiat: new BigNumber('0')
      })
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
        value.fil,
        wallet.balance,
        toAddressError,
        valueError,
        uncaughtError
      )
    ) {
      setUncaughtError('Invalid form!')
    }

    if (wallet.type === LEDGER) {
      setStep(2)
      try {
        await sendMsg()
      } catch (err) {
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
          setUncaughtError(err.message)
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
          <ConfirmationCard
            walletType={wallet.type}
            value={value}
            toAddress={toAddress}
          />
        )}
        <SendCardForm onSubmit={onSubmit} autoComplete='off'>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
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
              >
                Step 1
              </Stepper>
            </Box>
          </Box>
          <Box mt={3}>
            {customizingGas ? (
              <GasCustomization
                estimateGas={estimateGas}
                exit={() => setCustomizingGas(false)}
                gasPrice={gasPrice}
                gasLimit={gasLimit}
                setGasPrice={setGasPrice}
                setGasLimit={setGasLimit}
              />
            ) : (
              <>
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
                  amount={value.fil.toAttoFil()}
                  onAmountChange={setValue}
                  balance={wallet.balance}
                  error={valueError}
                  setError={setValueError}
                  gasLimit={gasLimit}
                  disabled={step === 2 && !hasError()}
                  valid={isValidAmount(value.fil, wallet.balance, valueError)}
                />
                <Box display='flex' flexDirection='column'>
                  <Input.Text
                    onChange={() => {}}
                    label='Transfer Fee'
                    value='< 0.1FIL'
                    backgroundColor='background.screen'
                    disabled
                  />
                  <Text
                    color='core.primary'
                    css={`
                      &:hover {
                        cursor: pointer;
                      }
                      text-decoration: underline;
                      align-self: flex-end;
                    `}
                    onClick={() => setCustomizingGas(true)}
                  >
                    Advanced
                  </Text>
                </Box>
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='center'
                  justifyContent='space-between'
                  mt={3}
                  mx={1}
                >
                  <Total fontSize={4}>Total</Total>
                  <Box display='flex' flexDirection='column' textAlign='right'>
                    <BigTitle color='core.primary'>
                      {makeFriendlyBalance(
                        new BigNumber(value.fil.toFil()),
                        10
                      )}{' '}
                      FIL
                    </BigTitle>
                    <Title color='core.darkgray'>
                      {makeFriendlyBalance(value.fiat, 7)} USD
                    </Title>
                  </Box>
                </Box>
              </>
            )}
          </Box>
          {!customizingGas && (
            <FloatingContainer>
              {step === 2 && wallet.type === LEDGER ? (
                <Text width='100%' textAlign='center' px={4}>
                  Confirm or reject the transaction on your Ledger Device.
                </Text>
              ) : (
                <>
                  <Button
                    type='button'
                    title={step === 1 ? 'Cancel' : 'Back'}
                    variant='secondary'
                    border={0}
                    borderRight={1}
                    borderRadius={0}
                    borderColor='core.lightgray'
                    onClick={() => {
                      setAttemptingTx(false)
                      setUncaughtError('')
                      resetLedgerState()
                      close()
                    }}
                    css={`
                      /* 'css' operation is used here to override its inherited border-radius property */
                      border-radius: 0px;
                    `}
                  />
                  <Button
                    border={0}
                    borderRadius={0}
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
                    title={step === 1 ? 'Next' : 'Confirm'}
                    variant='primary'
                    onClick={() => {}}
                    css={`
                      /* 'css' operation is used here to override its inherited border-radius property */
                      border-radius: 0px;
                    `}
                  />
                </>
              )}
            </FloatingContainer>
          )}
        </SendCardForm>
      </SendContainer>
    </>
  )
}

Send.propTypes = {
  close: PropTypes.func.isRequired
}

export default Send
