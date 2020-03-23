import React from 'react'
import PropTypes from 'prop-types'

import Box from '../Box'
import { Menu, MenuItem } from '../Menu'
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
    <Menu
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      borderColor='silver'
      height={300}
      m={2}
    >
      <MenuItem display='flex' justifyContent='space-between'>
        {loading ? <Loading /> : <Glyph Icon={Icon} acronym={glyphAcronym} />}
      </MenuItem>
      <MenuItem>
        <Stepper
          textColor='text'
          completedDotColor='status.success.background'
          incompletedDotColor='status.inactive'
          step={currentStep}
          totalSteps={totalSteps}
          ml={4}
        />
      </MenuItem>
      <Menu>
        <MenuItem mt={3}>
          <Text>{description}</Text>
        </MenuItem>
      </Menu>
    </Menu>
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

export const StepHeader = ({
  currentStep,
  title,
  glyphAcronym,
  Icon,
  loading,
  totalSteps
}) => {
  return (
    <Menu
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      borderColor='silver'
      width='100%'
    >
      <MenuItem display='flex' justifyContent='space-between'>
        {loading ? <Loading /> : <Glyph Icon={Icon} acronym={glyphAcronym} />}
      </MenuItem>
      <MenuItem mt={3}>
        <Text>{title}</Text>
      </MenuItem>
      <MenuItem>
        <Stepper
          textColor='text'
          completedDotColor='status.success.background'
          incompletedDotColor='status.inactive'
          step={currentStep}
          totalSteps={totalSteps}
          ml={4}
          my={0}
        />
      </MenuItem>
    </Menu>
  )
}

StepHeader.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  currentStep: PropTypes.number.isRequired,
  glyphAcronym: PropTypes.string,
  Icon: PropTypes.object,
  totalSteps: PropTypes.number.isRequired
}

StepHeader.defaultProps = {
  title: '',
  loading: false
}
