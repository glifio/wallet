import React from 'react'
import PropTypes from 'prop-types'

import { Menu, MenuItem } from '../Menu'
import Stepper from '../Stepper'
import Loading from '../LoaderGlyph'
import Glyph from '../Glyph'
import ErrorGlyph from '../Glyph/ErrorGlyph'

const StepHeader = ({
  currentStep,
  glyphAcronym,
  Icon,
  loading,
  totalSteps,
  showStepper,
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
      {showStepper && (
        <MenuItem>
          <Stepper
            textColor={error ? 'status.fail.foreground' : 'core.nearblack'}
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
      )}
    </Menu>
  )
}

StepHeader.propTypes = {
  loading: PropTypes.bool,
  currentStep: PropTypes.number.isRequired,
  glyphAcronym: PropTypes.string,
  Icon: PropTypes.object,
  totalSteps: PropTypes.number.isRequired,
  error: PropTypes.bool,
  showStepper: PropTypes.bool
}

StepHeader.defaultProps = {
  loading: false,
  error: false,
  glyphAcronym: '',
  showStepper: true
}

export default StepHeader
