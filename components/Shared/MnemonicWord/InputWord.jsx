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
import StyledWrapper from './StyledWrapper'
import Circle from './Circle'
import contentProps from './contentProps'

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
  ...contentProps,
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
    <StyledWrapper
      onBlur={() => setCompleted(true)}
      backgroundColor={setBackgroundColor({ valid, completed })}
    >
      <Circle color='core.primary' backgroundColor='core.secondary'>
        {num}
      </Circle>
      <MnemonicWordInput
        onFocus={() => setCompleted(false)}
        onChange={e => setWord(e.target.value)}
        completed={completed}
        value={word}
        valid={valid}
      />
    </StyledWrapper>
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
