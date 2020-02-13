import React from 'react'
import PropTypes from 'prop-types'

import {
  Box,
  Card,
  Text,
  Stepper,
  Glyph
} from '@openworklabs/filecoin-wallet-styleguide'

const StepCard = ({ step }) => {
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
          step={step}
          totalSteps={2}
          ml={4}
        />
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

StepCard.propTypes = {
  step: PropTypes.number.isRequired
}

export default StepCard
