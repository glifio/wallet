import React, { forwardRef } from 'react'
import { func, string, bool } from 'prop-types'
import { validateAddressString } from '@openworklabs/filecoin-address'
import TextInput from './Text'

const Address = forwardRef(
  ({ value, label, error, setError, ...props }, ref) => {
    return (
      <TextInput
        onBlur={() => {
          const isValidAddress = validateAddressString(value)
          if (value && !isValidAddress) setError(`Invalid ${label} address.`)
        }}
        onFocus={() => {
          if (error) setError('')
        }}
        ref={ref}
        label={label}
        value={value}
        error={error}
        {...props}
      />
    )
  }
)

Address.propTypes = {
  onChange: func,
  label: string,
  setError: func,
  value: string,
  error: string,
  placeholder: string,
  valid: bool
}

Address.defaultProps = {
  value: '',
  placeholder: 'f1...',
  onChange: () => {},
  setError: () => {},
  label: ''
}

export default Address
