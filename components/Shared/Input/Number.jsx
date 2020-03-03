import { forwardRef } from 'react'
import styled from 'styled-components'
import BaseInput from './BaseInput'
import InputWrapper from './InputWrapper'
import Box from '../Box'
import { Label } from '../Typography'

export const RawNumberInput = styled(BaseInput).attrs(props => ({ ...props }))`
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
`

export const Number = forwardRef(
  (
    { onChange, value, placeholder, label, error, setError, valid, ...props },
    ref
  ) => {
    return (
      <InputWrapper ref={ref} {...props}>
        <Box display='flex' alignItems='center'>
          <Box display='inline-block' px={3} minWidth={9} textAlign='center'>
            <Label>{label}</Label>
          </Box>
          <RawNumberInput
            onChange={onChange}
            value={value}
            valid={valid}
            error={error}
            setError={setError}
            placeholder={placeholder}
          />
        </Box>
      </InputWrapper>
    )
  }
)
