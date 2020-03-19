import React from 'react'
import PropTypes from 'prop-types'

import Box from '../Box'
import Card from '../Card'
import Stepper from '../Stepper'
import Loading from '../LoaderGlyph'
import Glyph from '../Glyph'
import { Text } from '../Typography'

const StepCard = ({
  currentStep,
  description,
  glyphAcronym,
  Icon,
  loading,
  totalSteps
}) => {
  return (
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      borderColor='silver'
      height={300}
      m={2}
    >
      <Box display='flex' alignItems='center'>
        {loading ? <Loading /> : <Glyph Icon={Icon} acronym={glyphAcronym} />}
        <Stepper
          textColor='text'
          completedDotColor='status.success.background'
          incompletedDotColor='status.inactive'
          step={currentStep}
          totalSteps={totalSteps}
          ml={4}
        />
      </Box>
      <Box display='block' mt={3}>
        <Text>{description}</Text>
      </Box>
    </Card>
  )
}

StepCard.propTypes = {
  description: PropTypes.string,
  loading: PropTypes.bool,
  currentStep: PropTypes.number.isRequired,
  glyphAcronym: PropTypes.string,
  Icon: PropTypes.object,
  totalSteps: PropTypes.number.isRequired
}

StepCard.defaultProps = {
  description: '',
  loading: false
}

export default StepCard
