import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
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
      <Title mt={3}>Write down your seed phrase</Title>
      <Menu
        display='flex'
        alignItems='center'
        justifyItems='center'
        flexWrap='wrap'
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
