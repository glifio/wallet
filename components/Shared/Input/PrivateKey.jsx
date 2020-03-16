import React, { forwardRef } from 'react'
import { func, string, bool } from 'prop-types'
import TextInput from './Text'
import { Label } from '../Typography'
import Box from '../Box'

const PrivateKey = forwardRef(
  ({ onChange, value, placeholder, error, setError, valid, ...props }, ref) => {
    return (
      <Box display='flex' flexDirection='column' alignItems='flex-end'>
        <Label color='status.fail.background' mt={3} mb={0}>
          {error}
        </Label>
        <TextInput
          onFocus={() => {
            if (error) setError('')
          }}
          ref={ref}
          label='Private key'
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          valid={valid}
          width={12}
          type='password'
          {...props}
        />
      </Box>
    )
  }
)

PrivateKey.propTypes = {
  onChange: func,
  setError: func,
  value: string,
  error: string,
  placeholder: string,
  valid: bool
}

PrivateKey.defaultProps = {
  value: '',
  placeholder: 'Your private key',
  onChange: () => {},
  setError: () => {}
}

export default PrivateKey
