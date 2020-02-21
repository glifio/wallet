import React, { useState } from 'react'
import {
  Box,
  Card,
  Input,
  Stepper,
  Text
} from '@openworklabs/filecoin-wallet-styleguide'
import FilecoinNumber from '@openworklabs/filecoin-number'

export default () => {
  const [toAddress, setToAddress] = useState('')
  // const [value, setValue] = useState('')

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
          step={1}
          totalSteps={2}
        >
          Step 1
        </Stepper>
      </Box>
      <Box mt={3}>
        <Input.Address
          onChange={e => setToAddress(e.target.value)}
          value={toAddress}
          label='RECIPIENT'
          placeholder='t1...'
        />
        {/* <Input.Funds
          onChange={handleValueChange}
          value={value}
          label='AMOUNT'
          placeholder='0 FIL'
        /> */}
      </Box>
    </Card>
  )
}
