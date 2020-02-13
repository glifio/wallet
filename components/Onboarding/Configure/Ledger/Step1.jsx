import React from 'react'
import PropTypes from 'prop-types'

import {
  Box,
  Button,
  Card,
  Text,
  Stepper,
  Glyph,
  Title
} from '@openworklabs/filecoin-wallet-styleguide'

const Step1Card = () => {
  return (
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      borderColor='silver'
      height={300}
      mr={2}
    >
      <Box display='flex' alignItems='center'>
        <Glyph acronym='Ld' />
        <Stepper
          textColor='text'
          completedDotColor='green'
          incompletedDotColor='silver'
          step={1}
          totalSteps={2}
          ml={4}
        >
          Step 1
        </Stepper>
      </Box>
      <Box display='block' mt={3}>
        <Text>
          Please complete the following steps so Filament can interface with
          your Ledger device
        </Text>
      </Box>
    </Card>
  )
}

Step1Card.propTypes = {}

const Step1Helper = () => (
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
      <Step1Card />
      <Step1Helper />
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
        onClick={() => console.log('going back')}
        type='primary'
        ml={2}
      />
    </Box>
  </>
)
