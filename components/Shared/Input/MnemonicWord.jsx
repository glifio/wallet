import React from 'react'
import styled from 'styled-components'
import {
  color,
  space,
  layout,
  border,
  flexbox,
  typography
} from 'styled-system'
import { func, string, bool } from 'prop-types'
import Box from '../Box'

export const MnemonicWordInput = styled.input.attrs(props => ({
  display: 'inline-block',
  width: '100%',
  height: 5,
  textAlign: 'center',
  backgroundColor: 'core.transparent',
  borderRadius: 6,
  border: 0,
  outline: 0
}))`
  ::placeholder {
    color: ${props => props.theme.colors.core.secondary};
  }

  &:focus {
    box-shadow: 0;
    outline: 0;
    background: ${props => {
      if (props.valid) return props.theme.colors.input.background.valid
      if (props.error) return props.theme.colors.input.background.invalid
      return props.theme.colors.core.primary
    }};
  }
  ${color}
  ${space}
  ${layout}
  ${border}
  ${flexbox}
  ${typography}
`

const MnemonicWord = ({
  onChange,
  value,
  placeholder,
  label,
  error,
  disabled,
  valid,
  num,
  ...props
}) => (
  <>
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      maxWidth={9}
      backgroundColor='core.primary'
      color='core.secondary'
      borderRadius={6}
      py={2}
      m={2}
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexGrow='999'
        color='core.primary'
        backgroundColor='core.secondary'
        height={5}
        width={6}
        mx={2}
        border={1}
        borderColor='core.secondary'
        fontSize={3}
        borderRadius={6}
      >
        10
      </Box>
      <MnemonicWordInput
        label={label}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        error={error}
        valid={valid}
        {...props}
      />
    </Box>
  </>
)

MnemonicWord.propTypes = {
  onChange: func,
  label: string,
  setError: func,
  value: string,
  error: string,
  placeholder: string,
  valid: bool,
  disabled: bool,
  numWord: string
}

MnemonicWord.defaultProps = {
  value: '',
  placeholder: 'tunafish',
  onChange: () => {},
  setError: () => {},
  label: '',
  disabled: false,
  numWord: ''
}

export default MnemonicWord
