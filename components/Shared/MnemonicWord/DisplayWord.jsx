import React from 'react'
import styled from 'styled-components'
import { string, number, bool } from 'prop-types'
import Box from '../Box'

const setBackgroundColor = props => {
  if (props.valid) return 'status.success.background'
  return 'core.primary'
}

const setColor = props => {
  if (props.valid) return 'status.success.foreground'
  return 'core.white'
}

export const Word = styled(Box).attrs(props => ({
  display: 'inline-block',
  width: '100%',
  height: 5,
  textAlign: 'center',
  backgroundColor: 'core.transparent',
  borderRadius: 6,
  border: 0,
  outline: 0,
  color: setColor(props)
}))`
  line-height: 2;
`

const DisplayWord = ({ word, num, valid }) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      width={12}
      maxWidth={9}
      backgroundColor={setBackgroundColor({ word, num, valid })}
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
        color={valid ? 'core.white' : 'core.primary'}
        backgroundColor={valid ? 'status.success.foreground' : 'core.secondary'}
        height={5}
        width={6}
        mx={2}
        border={1}
        borderColor={valid ? 'status.success.foreground' : 'core.secondary'}
        fontSize={3}
        borderRadius={6}
      >
        {num}
      </Box>
      <Word valid={valid}>{word}</Word>
    </Box>
  )
}

DisplayWord.propTypes = {
  word: string.isRequired,
  num: number.isRequired,
  valid: bool
}

DisplayWord.defaultProps = {
  valid: false
}

export default DisplayWord
