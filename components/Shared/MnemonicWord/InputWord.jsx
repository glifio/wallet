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
import { func, string, number, bool } from 'prop-types'
import StyledWrapper from './StyledWrapper'
import Circle from './Circle'
import contentProps from './contentProps'

const setBackgroundColor = ({ completed, empty, valid, importSeedError }) => {
  if (importSeedError && (empty || !valid)) return 'status.fail.background'
  if (!importSeedError && completed) return 'core.secondary'
  if (!importSeedError && empty) return 'core.white'
  return 'core.secondary'
}

const setInputColor = ({ completed, importSeedError }) => {
  if (importSeedError) return 'core.nearblack'
  if (!importSeedError && completed) return 'core.primary'
  return 'core.primary'
}

export const MnemonicWordInput = styled.input.attrs(props => ({
  ...contentProps,
  borderRadius: 0,
  color: setInputColor(props)
}))`
  max-width: 70%;
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
  wordToMatch,
  correctWordCount,
  setCorrectWordCount,
  importSeedError
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
      backgroundColor={setBackgroundColor({
        completed,
        importSeedError,
        valid: word === wordToMatch,
        empty: !word
      })}
      border={1}
      borderColor={
        !word || word !== wordToMatch
          ? importSeedError && 'status.fail.background'
          : 'core.primary'
      }
    >
      <Circle color='core.primary' backgroundColor='core.secondary'>
        {num}
      </Circle>
      <MnemonicWordInput
        onFocus={() => setCompleted(false)}
        onChange={e => setWord(e.target.value)}
        completed={completed}
        value={word}
        importSeedError={importSeedError}
      />
    </StyledWrapper>
  )
}

MnemonicWord.propTypes = {
  wordToMatch: string.isRequired,
  correctWordCount: number.isRequired,
  setCorrectWordCount: func.isRequired,
  num: number.isRequired,
  importSeedError: bool.isRequired
}

export default MnemonicWord
