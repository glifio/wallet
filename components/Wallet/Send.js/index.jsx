import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Box,
  BigTitle,
  Card,
  Input,
  Stepper,
  Text,
  Button,
  Label,
  Title
} from '@openworklabs/filecoin-wallet-styleguide'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'
import { validateAddressString } from '@openworklabs/filecoin-address'
import Message from '@openworklabs/filecoin-message'

import ConfirmationCard from './ConfirmationCard'
import ErrorCard from './ErrorCard'
import { useWallet } from '../hooks'
import { useWalletProvider } from '../../../WalletProvider'
import { LEDGER } from '../../../constants'

const SendScreen = styled(Card)`
  background-color: ${props => props.theme.colors.background.screen};
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

export default () => {
  const wallet = useWallet()
  const { walletProvider } = useWalletProvider()
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [value, setValue] = useState({
    fil: new FilecoinNumber('0', 'fil'),
    fiat: new BigNumber('0')
  })
  const [valueError, setValueError] = useState('')
  const [signingError, setSigningError] = useState('')
  const [gasPrice, setGasPrice] = useState('1')
  const [gasLimit, setGasLimit] = useState('1000')
  const [step, setStep] = useState(2)

  const submitMsg = async () => {
    const nonce = await walletProvider.getNonce(wallet.address)
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
    const signature = await walletProvider.wallet.sign(
      wallet.path,
      serializedMessage
    )
    const messageObj = message.encode()
    const msgCid = await walletProvider.sendMessage(messageObj, signature)
    messageObj.cid = msgCid['/']
    return messageObj
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (
      !isValidForm(
        toAddress,
        value.fil,
        wallet.balance,
        toAddressError,
        valueError,
        signingError
      )
    ) {
      setSigningError('Invalid form!')
    }
    if (step === 1 && wallet.type !== LEDGER) {
      setStep(2)
    } else {
      try {
        const message = await submitMsg()
        setStep(2)
      } catch (err) {
        setSigningError(err.message)
      }
    }
  }

  return (
    <>
      {signingError && (
        <ErrorCard error={signingError} reset={() => setStep(2)} />
      )}
      {step === 2 && (
        <ConfirmationCard
          walletType={wallet.type}
          value={value}
          toAddress={toAddress}
        />
      )}
      <SendScreen
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        border='none'
        width='auto'
        m={4}
      >
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <Box
              display='flex'
              flexDirection='column'
              justifyContent='center'
              width={6}
              height={6}
              backgroundColor='core.primary'
            >
              <Text textAlign='center' color='white'>
                To
              </Text>
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
          <form onSubmit={onSubmit}>
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
                backgroundColor='#E4EBFC'
                disabled
              />
              <Input.Text
                label='Completed In'
                value='Approx. 17 Seconds'
                onChange={() => {}}
                backgroundColor='#E4EBFC'
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
                <Title color='core.darkgray'>{value.fiat.toString()} USD</Title>
              </Box>
            </Box>
            <Box display='flex' flexDirection='row' justifyContent='center'>
              <Button
                title='Cancel'
                buttonStyle='secondary'
                onClick={() => {}}
              />
              <Button
                disabled={
                  !isValidForm(
                    toAddress,
                    value.fil,
                    wallet.balance,
                    toAddressError,
                    valueError
                  )
                }
                type='submit'
                title='Next'
                buttonStyle='primary'
                onClick={() => {}}
              />
            </Box>
          </form>
        </Box>
      </SendScreen>
    </>
  )
}
