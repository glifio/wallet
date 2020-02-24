import React, { forwardRef } from 'react'
import { func, string } from 'prop-types'
import { validateAddressString } from '@openworklabs/filecoin-address'
import TextInput from './Text'

const Address = forwardRef(
  ({ onChange, value, placeholder, label, error, setError, ...props }, ref) => {
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
        {...props}
      />
    )
  }
)

Address.propTypes = {
  onChange: func.isRequired,
  label: string.isRequired,
  setError: func.isRequired,
  value: string,
  error: string,
  placeholder: string
}

Address.defaultProps = {
  value: '',
  placeholder: 'f1...'
}

export default Address
