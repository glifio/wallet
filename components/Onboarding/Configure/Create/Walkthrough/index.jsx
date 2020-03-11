import React from 'react'
import PropTypes from 'prop-types'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import RevealMnemonic from './RevealMnemonic'
import { BigTitle, Card, Text } from '../../../../Shared'
import WordPrompt from './WordPrompt'
import generateRandomWords from '../../../../../utils/generateRandomWords'

const indexToWord = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth'
]

const Stage = ({ mnemonic, walkthroughStep }) => {
  const [first, second, third, fourth] = generateRandomWords(mnemonic, 4)
  switch (walkthroughStep) {
    case 1:
      return <RevealMnemonic mnemonic={mnemonic} />
    case 2:
      return (
        <WordPrompt wordToMatch={first.word} index={indexToWord[first.index]} />
      )
    case 3:
      return (
        <WordPrompt
          wordToMatch={second.word}
          index={indexToWord[second.index]}
        />
      )
    case 4:
      return (
        <WordPrompt wordToMatch={third.word} index={indexToWord[third.index]} />
      )
    case 5:
      return (
        <WordPrompt
          wordToMatch={fourth.word}
          index={indexToWord[fourth.index]}
        />
      )
    default:
      return <Text>Error, how the hell did you get here?</Text>
  }
}

Stage.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE,
  walkthroughStep: PropTypes.number.isRequired
}

const Walkthrough = ({ mnemonic, walkthroughStep }) => {
  return (
    <Card
      width={16}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      {walkthroughStep < 6 ? (
        <Stage mnemonic={mnemonic} walkthroughStep={walkthroughStep} />
      ) : (
        <BigTitle>Thank you</BigTitle>
      )}
    </Card>
  )
}

Walkthrough.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE,
  walkthroughStep: PropTypes.number.isRequired
}

export default Walkthrough
