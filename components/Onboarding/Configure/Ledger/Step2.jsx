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
      <Title>First</Title>
    </Box>
    <Box display='block' mt={3}>
      <Text>Please connect your Ledger to your computer.</Text>
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
        title='Yes, my Ledger device is connected.'
        onClick={() => console.log('going forward')}
        type='primary'
        ml={2}
      />
    </Box>
  </>
)
