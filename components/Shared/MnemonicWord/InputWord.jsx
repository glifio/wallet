import React, { useEffect, useState } from 'react'
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
  if (props.completed) return 'core.primary'
  return 'core.white'
}

const setInputColor = props => {
  if (props.valid) return 'status.success.foreground'
  if (props.completed) return 'core.white'
  return 'core.primary'
}

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

const MnemonicWord = ({
  num,
  valid,
  wordToMatch,
  correctWordCount,
  setCorrectWordCount
}) => {
  const [word, setWord] = useState('')
  const [completed, setCompleted] = useState(false)
  const [bumpedCorrectWordCount, setBumpedCorrectWordCount] = useState(false)
  useEffect(() => {
    if (word === wordToMatch && !bumpedCorrectWordCount) {
      setBumpedCorrectWordCount(true)
      setCorrectWordCount(correctWordCount + 1)
    }
    if (word !== wordToMatch && bumpedCorrectWordCount) {
      setBumpedCorrectWordCount(false)
      setCorrectWordCount(correctWordCount - 1)
    }
  }, [
    word,
    wordToMatch,
    bumpedCorrectWordCount,
    setBumpedCorrectWordCount,
    setCorrectWordCount,
    correctWordCount
  ])

  return (
    <Box
      onBlur={() => {
        setCompleted(true)
      }}
      display='flex'
      alignItems='center'
      justifyContent='center'
      maxWidth={9}
      backgroundColor={setBackgroundColor({ valid, completed })}
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
        onFocus={() => setCompleted(false)}
        onChange={e => setWord(e.target.value)}
        completed={completed}
        value={word}
        valid={valid}
      />
    </Box>
  )
}

MnemonicWord.propTypes = {
  wordToMatch: string.isRequired,
  correctWordCount: number.isRequired,
  setCorrectWordCount: func.isRequired,
  num: number.isRequired,
  valid: bool
}

MnemonicWord.defaultProps = {
  valid: false
}

export default MnemonicWord
