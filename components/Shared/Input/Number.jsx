import { forwardRef } from 'react'
import { func, string, bool } from 'prop-types'
import styled from 'styled-components'
import BaseInput from './BaseInput'
import InputWrapper from './InputWrapper'
import Box from '../Box'
import { Label } from '../Typography'

import { inputBackgroundColor } from './inputBackgroundColors'

export const DenomTag = styled(Box).attrs(props => ({
  display: 'flex',
  height: '100%',
  px: 3,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 3,
  minWidth: 7,
  color: 'core.primary',
  ...props
}))`
  text-align: center;
  position: relative;
  background: ${props => inputBackgroundColor(props)};
`

export const RawNumberInput = styled(BaseInput)`
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
      disabled,
      onChange,
      value,
      placeholder,
      label,
      error,
      setError,
      valid,
      // top, bottom, and middle are props to pass if you are stacking numbered inputs
      top,
      bottom,
      middle,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper ref={ref} {...props}>
        <Box position='relative' display='flex' alignItems='center'>
          {label && (
            <Box
              display='inline-block'
              px={2}
              minWidth={[9, 9, 10]}
              textAlign='left'
            >
              <Label>{label}</Label>
            </Box>
          )}
          <Box
            position='relative'
            display='flex'
            justifyContent='flex-end'
            width='100%'
            borderBottom='1px solid'
            borderTop='1px solid'
            color='background.screen'
          >
            <RawNumberInput
              type='number'
              onChange={onChange}
              value={value}
              valid={valid}
              disabled={disabled}
              error={error}
              setError={setError}
              placeholder={placeholder}
              borderBottomLeftRadius={bottom && !middle && 2}
              borderTopLeftRadius={top && !middle && 2}
            />
            {denom && (
              <DenomTag
                height={6}
                top='0px'
                left='0px'
                valid={valid}
                disabled={disabled}
                borderTopRightRadius={top && !middle && 2}
                borderBottomRightRadius={bottom && !middle && 2}
              >
                {denom}
              </DenomTag>
            )}
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
  top: bool,
  bottom: bool,
  middle: bool,
  denom: string
}

NumberInput.defaultProps = {
  value: '',
  disabled: false,
  onChange: () => {},
  label: '',
  top: true,
  bottom: true,
  middle: false
}
