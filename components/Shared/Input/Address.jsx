import React, { forwardRef } from 'react'
import { func, string, bool } from 'prop-types'
import { validateAddressString } from '@openworklabs/filecoin-address'
import TextInput from './Text'

const Address = forwardRef(
  (
    { onChange, value, placeholder, label, error, setError, valid, ...props },
    ref
  ) => {
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
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        error={error}
        valid={valid}
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
