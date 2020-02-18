import React from 'react'

import {
  Box,
  Button,
  Card,
  Text,
  Title
} from '@openworklabs/filecoin-wallet-styleguide'

import StepCard from './StepCard'

const Step2Helper = () => (
  <Card
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    borderColor='silver'
    height={300}
    ml={2}
  >
    <Box display='flex' alignItems='center'>
      <Title>Next</Title>
    </Box>
    <Box display='block' mt={3}>
      <Text mb={1}>Please unlock your Ledger device</Text>
      <Text>And make sure the Filecoin App is open</Text>
    </Box>
  </Card>
)

export default () => (
  <>
    <Box
      mt={8}
      mb={6}
      display='flex'
      flexDirection='row'
      justifyContent='center'
    >
      <StepCard step={2} />
      <Step2Helper />
    </Box>
    <Box mt={6} display='flex' flexDirection='row' justifyContent='center'>
      <Button
        title='Back'
        onClick={() => console.log('going back')}
        type='secondary'
        mr={2}
      />
      <Button
        title='My Ledger device is unlocked  and Filecoin app open'
        onClick={() => console.log('going forward')}
        type='primary'
        ml={2}
      />
    </Box>
  </>
)
