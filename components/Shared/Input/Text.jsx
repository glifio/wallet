import React from 'react'
import styled from 'styled-components'
import { space, color, layout, border, flexbox } from 'styled-system'
import { func, string, bool } from 'prop-types'
import BaseInput from './BaseInput'
import Box from '../Box'
import { Label } from '../Typography'

const TextInputWrapper = styled.div`
  display: inline-block;
  border-radius: ${props => props.theme.radii[1]};
  ${color} 
  ${space} 
  ${layout}
  ${border}
  ${flexbox};
`

const TextInput = ({
  onChange,
  value,
  placeholder,
  label,
  error,
  disabled,
  valid,
  ...props
}) => (
  <>
    <TextInputWrapper
      width='100%'
      mt={3}
      border={1}
      borderColor='input.border'
      borderRadius={1}
    >
      <Box display='flex' alignItems='center'>
        <Box display='inline-block' px={3} minWidth='120px' textAlign='center'>
          <Label>{label}</Label>
        </Box>
        <BaseInput
          display='inline-block'
          py={3}
          px={3}
          height={7}
          border={0}
          borderLeft={1}
          borderColor='input.border'
          borderTopRightRadius={1}
          borderBottomRightRadius={1}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          valid={valid}
          {...props}
        />
      </Box>
    </TextInputWrapper>
    {error && <Label color='error.textLight'>{error}</Label>}
  </>
)

TextInput.propTypes = {
  onChange: func,
  label: string,
  value: string,
  placeholder: string,
  disabled: bool,
  error: string,
  valid: bool
}

TextInput.defaultProps = {
  value: '',
  disabled: false,
  onChange: () => {},
  label: ''
}

export default TextInput
