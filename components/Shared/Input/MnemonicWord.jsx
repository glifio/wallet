import React from 'react'
import styled from 'styled-components'
import { func, string, bool } from 'prop-types'
import BaseInput from './BaseInput'
import Box from '../Box'

const MnemonicWordInput = styled(BaseInput)`
  text-align: center;
  &:focus {
    border-radius: 100px;
    background: transparent;
  }
`

const MnemonicWord = ({
  onChange,
  value,
  placeholder,
  label,
  error,
  disabled,
  valid,
  numWord,
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
        color='core.primary'
        backgroundColor='core.secondary'
        width={6}
        height={5}
        mx={2}
        border={1}
        borderColor='core.secondary'
        fontSize={3}
        borderRadius={6}
      >
        {numWord}
      </Box>
      <MnemonicWordInput
        borderLeft={0}
        label={label}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        error={error}
        valid={valid}
        {...props}
        height={5}
        textAlign='center'
        backgroundColor='core.transparent'
        borderRadius={6}
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
