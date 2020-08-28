import React, { forwardRef, useRef, useState } from 'react'
import { validateMnemonic } from 'bip39'
import { func, string, bool } from 'prop-types'
import TextInput from './Text'
import Box from '../Box'
import BaseButton from '../Button/BaseButton'

const Mnemonic = forwardRef(
  ({ onChange, value, placeholder, error, setError, valid, ...props }, ref) => {
    const timer = useRef()
    const [reveal, setReveal] = useState(false)

    const validate = mnemonic => {
      let validMnemonic = false
      try {
        validMnemonic = validateMnemonic(mnemonic.trim())
      } catch (err) {
        validMnemonic = false
      }
      if (mnemonic && !validMnemonic) setError(`Invalid seed phrase.`)
    }

    return (
      <Box display='flex' flexDirection='row' alignItems='center'>
        <Box display='flex' flexDirection='column' alignItems='flex-end'>
          <Box display='block' textAlign='right' mb={2}>
            <BaseButton
              m='0'
              p='0'
              bg='core.transparent'
              color='core.primary'
              css={`
                cursor: pointer;
                outline: none;
              `}
              border='none'
              onClick={() => setReveal(!reveal)}
            >
              {reveal ? 'Hide' : 'Show'}
            </BaseButton>
          </Box>

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
            error={error}
            value={value}
            placeholder={placeholder}
            valid={valid}
            width={12}
            type={reveal ? 'text' : 'password'}
            {...props}
          />
        </Box>
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
