import React, { forwardRef, useRef } from 'react'
import bip39 from 'bip39'
import { func, string, bool } from 'prop-types'
import TextInput from './Text'

const Seed = forwardRef(
  ({ onChange, value, placeholder, error, setError, valid, ...props }, ref) => {
    const timer = useRef()

    const validate = mnemonic => {
      if (mnemonic && !bip39.validateMnemonic(mnemonic))
        setError(`Invalid seed phrase.`)
    }

    return (
      <TextInput
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
          timer.current = setTimeout(() => validate(seed), 500)
        }}
        value={value}
        placeholder={placeholder}
        error={error}
        valid={valid}
        width={12}
        {...props}
      />
    )
  }
)

Seed.propTypes = {
  onChange: func,
  setError: func,
  value: string,
  error: string,
  placeholder: string,
  valid: bool
}

Seed.defaultProps = {
  value: '',
  placeholder: 'Your seed phrase',
  onChange: () => {},
  setError: () => {}
}

export default Seed
