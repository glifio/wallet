import React from 'react'
import { func, string, bool } from 'prop-types'
import BaseInput from './BaseInput'
import Box from '../Box'
import { Label } from '../Typography'
import InputWrapper from './InputWrapper'

const TextInput = ({
  onChange,
  value,
  placeholder,
  label,
  error,
  disabled,
  valid,
  ...props
}) => (
  <>
    <InputWrapper mt={3}>
      <Box display='flex' alignItems='center'>
        {label && (
          <Box display='inline-block' px={3} minWidth={9} textAlign='center'>
            <Label>{label}</Label>
          </Box>
        )}
        <BaseInput
          py={3}
          px={3}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          valid={valid}
          {...props}
        />
      </Box>
    </InputWrapper>
    {error && (
      <Label color='status.fail.background' mt={3} mb={0}>
        {error}
      </Label>
    )}
  </>
)

TextInput.propTypes = {
  onChange: func,
  label: string,
  value: string,
  placeholder: string,
  disabled: bool,
  error: string,
  valid: bool
}

TextInput.defaultProps = {
  value: '',
  disabled: false,
  onChange: () => {},
  label: ''
}

export default TextInput
