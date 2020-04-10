import { forwardRef } from 'react'
import { func, string, bool, obj, node } from 'prop-types'
import { space, color, layout, border, flexbox } from 'styled-system'
import styled from 'styled-components'
import BaseInput from './BaseInput'
import InputWrapper from './InputWrapper'
import Box from '../Box'
import { Label } from '../Typography'

export const Tag = styled(Box).attrs(props => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 3,
  px: 3,
  color: 'core.primary',
  ...props
}))`
  text-align: center;
  position: absolute;
  ${color} 
  ${space} 
  ${layout}
  ${border}
  ${flexbox};
`

export const DenomTag = props => <Tag {...props}>{props.children}</Tag>

DenomTag.propTypes = {
  children: node
}

export const RawNumberInput = styled(BaseInput).attrs(props => ({
  ...props
}))`
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
`

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
      fontSize,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper ref={ref} {...props}>
        <Box position='relative' display='flex' alignItems='center'>
          {label && (
            <Box display='inline-block' px={3} minWidth={9} textAlign='center'>
              <Label>{label}</Label>
            </Box>
          )}
          <Box position='relative' width='100%'>
            {denom && (
              <DenomTag
                css={`
                  top: 0px;
                  left: 0px;
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
              fontSize={fontSize}
            />
          </Box>
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
  fontSize: obj,
  denom: string
}

NumberInput.defaultProps = {
  value: '',
  disabled: false,
  onChange: () => {},
  label: '',
  fontSize: 2
}
