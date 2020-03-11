import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { BigTitle, Box, Text, Input } from '../../../../Shared'

const WordPrompt = ({ index, wordToMatch }) => {
  const [word, setWord] = useState('')
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
            {index}&nbsp;
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
  index: PropTypes.number.isRequired,
  wordToMatch: PropTypes.string.isRequired
}

export default WordPrompt
