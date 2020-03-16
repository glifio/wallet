import React, { useState } from 'react'
import styled from 'styled-components'
import {
  color,
  space,
  layout,
  border,
  flexbox,
  typography
} from 'styled-system'
import { func, string, bool, number } from 'prop-types'
import Box from '../Box'

const setBackgroundColor = props => {
  if (props.valid) return 'status.success.background'
  if (props.fill) return 'core.primary'
  return 'core.white'
}

const setInputColor = props => {
  if (props.valid) return 'status.success.foreground'
  if (props.value) return 'core.white'
  return 'core.nearblack'
}

// &:focus {
//   box-shadow: 0;
//   outline: 0;
//   background: ${props => {
//     if (props.valid) return props.theme.colors.input.background.valid
//     if (props.error) return props.theme.colors.input.background.invalid
//     return props.theme.colors.core.primary
//   }};
// }

export const MnemonicWordInput = styled.input.attrs(props => ({
  display: 'inline-block',
  width: '100%',
  height: 5,
  textAlign: 'center',
  backgroundColor: 'core.transparent',
  borderRadius: 6,
  border: 0,
  outline: 0,
  color: setInputColor(props)
}))`
  &:focus {
    box-shadow: 0;
    outline: 0;
  }
  ${color}
  ${space}
  ${layout}
  ${border}
  ${flexbox}
  ${typography}
`

const MnemonicWord = ({ onChange, value, disabled, valid, num, ...props }) => {
  const [fill, setFill] = useState(!!value)
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      maxWidth={9}
      backgroundColor={setBackgroundColor({ valid, fill })}
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
        {num}
      </Box>
      <MnemonicWordInput
        onChange={onChange}
        value={value}
        valid={valid}
        {...props}
      />
    </Box>
  )
}

MnemonicWord.propTypes = {
  onChange: func,
  value: string,
  valid: bool,
  disabled: bool,
  num: number.isRequired
}

MnemonicWord.defaultProps = {
  value: '',
  onChange: () => {},
  disabled: false
}

export default MnemonicWord
