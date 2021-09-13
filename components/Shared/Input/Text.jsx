import React from 'react'
import { string, bool } from 'prop-types'
import BaseInput from './BaseInput'
import Box from '../Box'
import { Label } from '../Typography'
import InputWrapper from './InputWrapper'
import { DenomTag } from './Number'

const TextInput = React.forwardRef(
  ({ denom, label, error, disabled, ...props }, ref) => (
    <>
      <InputWrapper>
        <Box display='flex' alignItems='center'>
          {label && (
            <Box
              display='flex'
              justifyContent='flex-start'
              alignItems='center'
              minWidth={6}
              mr={3}
            >
              <Label color='core.nearblack'>{label}</Label>
            </Box>
          )}
          <Box position='relative' display='flex' flex='1' alignItems='center'>
            <BaseInput
              ref={ref}
              px={3}
              borderRadius={2}
              disabled={disabled}
              error={error}
              {...props}
            />
            {denom && (
              <DenomTag height={7} backgroundColor='core.transparent'>
                {denom}
              </DenomTag>
            )}
          </Box>
        </Box>
      </InputWrapper>
      {error && (
        <Box textAlign='right' pt={2} mb={0}>
          <Label color='status.fail.background' m={0} textAlign='right'>
            {error}
          </Label>
        </Box>
      )}
    </>
  )
)

TextInput.propTypes = {
  label: string,
  placeholder: string,
  disabled: bool,
  error: string,
  valid: bool,
  denom: string,
  name: string
}

TextInput.defaultProps = {
  disabled: false,
  label: '',
  denom: '',
  name: ''
}

export default TextInput
