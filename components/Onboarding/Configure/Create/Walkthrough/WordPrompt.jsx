import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  Box,
  Title,
  Menu,
  MenuItem,
  DisplayWord as Word,
  InputWord
} from '../../../../Shared'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import generateRandomWords from '../../../../../utils/generateRandomWords'

const WordPrompt = ({
  importSeedError,
  canContinue,
  mnemonic,
  setCanContinue
}) => {
  const randoms = useRef()
  if (!randoms.current) randoms.current = generateRandomWords(mnemonic, 4)
  const [correctWordCount, setCorrectWordCount] = useState(0)

  useEffect(() => {
    if (!canContinue && correctWordCount === 4) setCanContinue(true)
    if (canContinue && correctWordCount !== 4) setCanContinue(false)
  })
  return (
    <>
      <Box
        display='flex'
        flexDirection='row'
        width='100%'
        justifyContent='space-between'
        height={7}
      >
        <Title mt={3}>Add the correct words to the empty inputs</Title>
      </Box>
      <Menu
        display='flex'
        alignItems='center'
        justifyItems='center'
        flexWrap='wrap'
        mt={3}
      >
        {mnemonic.split(' ').map((word, i) => {
          return (
            /* eslint-disable react/no-array-index-key */
            <MenuItem key={i}>
              {randoms.current.has(i) ? (
                <InputWord
                  correctWordCount={correctWordCount}
                  num={i + 1}
                  wordToMatch={word}
                  setCorrectWordCount={setCorrectWordCount}
                  importSeedError={importSeedError}
                />
              ) : (
                <Word num={i + 1} word={word} />
              )}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

WordPrompt.propTypes = {
  canContinue: PropTypes.bool.isRequired,
  importSeedError: PropTypes.bool.isRequired,
  mnemonic: MNEMONIC_PROPTYPE,
  setCanContinue: PropTypes.func.isRequired
}

export default WordPrompt
