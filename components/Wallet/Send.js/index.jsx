import React, { useState } from 'react'
import {
  Box,
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

import { useWallet } from '../hooks'

const isValidForm = (toAddress, value, balance, toAddressError, valueError) => {
  const validToAddress = validateAddressString(toAddress)
  const errorFree = validToAddress && !toAddressError && !valueError
  const fieldsFilledOut = toAddress && value && value.isGreaterThan(0)
  const enoughInTheBank = balance.isGreaterThan(value)
  return !!(errorFree && fieldsFilledOut && enoughInTheBank)
}

export default () => {
  const wallet = useWallet()
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  const [value, setValue] = useState({
    fil: new FilecoinNumber('0', 'fil'),
    fiat: new BigNumber('0')
  })
  const [valueError, setValueError] = useState('')
  const [gasPrice, setGasPrice] = useState('1')
  const [gasLimit, setGasLimit] = useState('1000')
  const [step, setStep] = useState(1)

  const onSubmit = async e => {
    e.preventDefault()
    console.log('im here')
  }

  return (
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      border='none'
      width='auto'
      ml={4}
      mr={4}
    >
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            width={6}
            height={6}
            backgroundColor='purple'
          >
            <Text textAlign='center' color='white'>
              To
            </Text>
          </Box>
          <Text color='purple' ml={2}>
            Sending Filecoin
          </Text>
        </Box>
        <Stepper
          textColor='purple'
          completedDotColor='purple'
          incompletedDotColor='silver'
          step={step}
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
              disabled
            />
            <Input.Text
              label='Completed In'
              value='Approx. 17 Seconds'
              onChange={() => {}}
              disabled
            />
          </Box>
          <Card
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
          >
            <Label>Total</Label>
            <Box display='flex' flexDirection='column'>
              <Title>{value.fil.toFil()} FIL</Title>
              <Text>{value.fiat.toString()} USD</Text>
            </Box>
          </Card>
          <hr />
          <Box display='flex' flexDirection='row' justifyContent='center'>
            <Button title='Cancel' buttonStyle='secondary' onClick={() => {}} />
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
    </Card>
  )
}
