import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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
  Label as Total,
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
      messageObj.timestamp = Date.now()
      messageObj.gas_used = (
        await walletProvider.estimateGas(messageObj)
      ).toAttoFil()
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

    try {
      setStep(2)
      const message = await submitMsg()
      if (message) {
        dispatch(confirmMessage(toLowerCaseMsgFields(message)))
        setValue({
          fil: new FilecoinNumber('0', 'fil'),
          fiat: new BigNumber('0')
        })
        close()
        setToAddress('')
        setAttemptingTx(false)
      }
    } catch (err) {
      setUncaughtError(err.message)
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
      {step === 2 && !hasError() && (
        <ConfirmationCard
          walletType={wallet.type}
          value={value}
          toAddress={toAddress}
        />
      )}
      <SendCardForm onSubmit={onSubmit} autoComplete='off'>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
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
            <ButtonClose ml={2} type='button' onClick={close} />
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
                  Adjust transfer fee
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
                    {makeFriendlyBalance(new BigNumber(value.fil.toFil()), 10)}{' '}
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
              <Text>
                Confirm or reject the transaction on your Ledger Device.
              </Text>
            ) : (
              <>
                <Button
                  type='button'
                  title='Cancel'
                  variant='secondary'
                  onClick={() => {
                    setAttemptingTx(false)
                    setUncaughtError('')
                    resetLedgerState()
                    close()
                  }}
                />
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
                  variant='primary'
                  onClick={() => {}}
                />
              </>
            )}
          </FloatingContainer>
        )}
      </SendCardForm>
    </SendContainer>
  )
}

Send.propTypes = {
  close: PropTypes.func.isRequired
}

export default Send
