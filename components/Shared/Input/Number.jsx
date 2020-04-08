import { forwardRef } from 'react'
import { space, color, layout, border, flexbox } from 'styled-system'
import { func, string, bool, node } from 'prop-types'
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

const Tag = styled(Box).attrs(props => ({
  minWidth: 6,
  bg: 'core.primary',
  color: 'core.white',
  p: 2,
  ...props
}))`
  text-align: center;
  position: absolute;
  border-radius: 4px;
  ${color} 
  ${space} 
  ${layout}
  ${border}
  ${flexbox};
`

export const DenomTag = props => (
  <Box
    css={`
      position: relative;
    `}
  >
    <Tag {...props}>{props.children}</Tag>
  </Box>
)

DenomTag.propTypes = {
  children: node
}

export const NumberInput = forwardRef(
  (
    {
      denom,
      onChange,
      value,
      placeholder,
      label,
      error,
      setError,
      valid,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper ref={ref} {...props}>
        <Box display='flex' alignItems='center'>
          {label && (
            <Box display='inline-block' px={3} minWidth={9} textAlign='center'>
              <Label>{label}</Label>
            </Box>
          )}
          {denom && (
            <DenomTag
              css={`
                top: -16px;
                left: 20px;
              `}
            >
              {denom}
            </DenomTag>
          )}
          <RawNumberInput
            type='number'
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

NumberInput.propTypes = {
  onChange: func,
  label: string,
  value: string,
  placeholder: string,
  disabled: bool,
  error: string,
  valid: bool,
  denom: string
}

NumberInput.defaultProps = {
  value: '',
  disabled: false,
  onChange: () => {},
  label: ''
}
