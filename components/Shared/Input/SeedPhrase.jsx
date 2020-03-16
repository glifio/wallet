import React from 'react'
import { func, string, bool } from 'prop-types'
import { Input, Box } from '../../Shared'

const SeedPhrase = ({
  onChange,
  value,
  placeholder,
  label,
  error,
  disabled,
  valid,
  ...props
}) => (
  <Box display='flex' maxWidth={10}>
    <Box backgroundColor='core.primary' borderRadius={6}>
      1
    </Box>
    <Input
      label={label}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      error={error}
      valid={valid}
      {...props}
    />
  </Box>
)

SeedPhrase.propTypes = {
  onChange: func,
  label: string,
  setError: func,
  value: string,
  error: string,
  placeholder: string,
  valid: bool,
  disabled: bool
}

SeedPhrase.defaultProps = {
  value: '',
  placeholder: 'tunafish',
  onChange: () => {},
  setError: () => {},
  label: '',
  disabled: false
}

export default SeedPhrase
