import React from 'react'
import styled from 'styled-components'
import { space, color, layout, border, flexbox } from 'styled-system'
import { func, string, bool } from 'prop-types'
import BaseInput from './BaseInput'
import Box from '../Box'
import { Label } from '../Typography'

const TextInputWrapper = styled.div`
  display: inline-block;
  /* border: ${props => props.theme.borders[1]}; */
  /* border-color: ${props => props.theme.colors.core.darkgray}; */
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
  ...props
}) => (
  <>
    <TextInputWrapper
      width="100%"
      mt={3}
      border={1}
      borderColor="input.border"
      borderRadius={1}
    >
      <Box display="flex" alignItems="center">
        <Box display="inline-block" px={3} minWidth="120px" textAlign="center">
          {label}
        </Box>
        {/* how do we chunk the address in the input component? */}
        <BaseInput
          display="inline-block"
          py={3}
          px={3}
          height={7}
          border={0}
          borderLeft={1}
          borderColor="input.border"
          borderTopRightRadius={1}
          borderBottomRightRadius={1}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      </Box>
    </TextInputWrapper>
    {error && <Label color="error.textLight">{error}</Label>}
  </>
)

TextInput.propTypes = {
  onChange: func.isRequired,
  label: string.isRequired,
  value: string,
  placeholder: string,
  disabled: bool,
  error: string
}

TextInput.defaultProps = {
  value: '',
  bool: false
}

export default TextInput
