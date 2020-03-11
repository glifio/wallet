import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { BigTitle, Box, Text, Input } from '../../../../Shared'

const WordPrompt = ({ numWord, wordToMatch, setCanContinue }) => {
  const [word, setWord] = useState('')

  useEffect(() => {
    return () => setWord('')
  }, [numWord, wordToMatch])

  useEffect(() => {
    if (word === wordToMatch) setCanContinue(true)
  }, [word, wordToMatch, setCanContinue])

  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <BigTitle>Please follow the prompts</BigTitle>
      <Box display='flex' flexDirection='column'>
        <Box display='flex' flexDirection='row'>
          <Text my={1}>What&rsquo;s the&nbsp;</Text>
          <Text my={1} color='core.primary'>
            {numWord} word &nbsp;
          </Text>
          <Text my={1}>in your seed phrase?</Text>
        </Box>
        <Input.Text
          placeholder='tunafish'
          value={word}
          onChange={e => setWord(e.target.value)}
        />
      </Box>
    </Box>
  )
}

WordPrompt.propTypes = {
  numWord: PropTypes.string.isRequired,
  wordToMatch: PropTypes.string.isRequired,
  setCanContinue: PropTypes.func.isRequired
}

export default WordPrompt
