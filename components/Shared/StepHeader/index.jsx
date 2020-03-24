import React from 'react'
import PropTypes from 'prop-types'

import { Menu, MenuItem } from '../Menu'
import Stepper from '../Stepper'
import Loading from '../LoaderGlyph'
import Glyph from '../Glyph'
import ErrorGlyph from '../Glyph/ErrorGlyph'
import { Text } from '../Typography'

const StepHeader = ({
  currentStep,
  title,
  glyphAcronym,
  Icon,
  loading,
  totalSteps,
  error
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
        {error && <ErrorGlyph />}
        {loading && !error && <Loading />}
        {!loading && !error && <Glyph Icon={Icon} acronym={glyphAcronym} />}
      </MenuItem>

      <MenuItem>
        <Stepper
          textColor='text'
          completedDotColor={
            error ? 'status.fail.foreground' : 'status.success.background'
          }
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
  totalSteps: PropTypes.number.isRequired,
  error: PropTypes.bool
}

StepHeader.defaultProps = {
  title: '',
  loading: false,
  error: false
}

export default StepHeader
