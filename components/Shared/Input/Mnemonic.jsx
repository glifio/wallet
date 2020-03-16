import React, { forwardRef, useRef } from 'react'
import { validateMnemonic } from 'bip39'
import { func, string, bool } from 'prop-types'
import TextInput from './Text'
import { Label } from '../Typography'
import Box from '../Box'

const Mnemonic = forwardRef(
  ({ onChange, value, placeholder, error, setError, valid, ...props }, ref) => {
    const timer = useRef()

    const validate = mnemonic => {
      let validMnemonic = false
      try {
        validMnemonic = validateMnemonic(mnemonic)
      } catch (err) {
        validMnemonic = false
      }
      if (mnemonic && !validMnemonic) setError(`Invalid seed phrase.`)
    }

    return (
      <Box display='flex' flexDirection='column' alignItems='flex-end'>
        <Label color='status.fail.background' mt={3} mb={0}>
          {error}
        </Label>
        <TextInput
          backgroundRadius={6}
          onBlur={() => validate(value)}
          onFocus={() => {
            if (error) setError('')
          }}
          ref={ref}
          label='Seed phrase'
          onChange={e => {
            clearTimeout(timer.current)
            onChange(e)
            const seed = e.target.value
            timer.current = setTimeout(() => validate(seed), 1000)
          }}
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

Mnemonic.propTypes = {
  onChange: func,
  setError: func,
  value: string,
  error: string,
  placeholder: string,
  valid: bool
}

Mnemonic.defaultProps = {
  value: '',
  placeholder: 'Your seed phrase',
  onChange: () => {},
  setError: () => {}
}

export default Mnemonic
