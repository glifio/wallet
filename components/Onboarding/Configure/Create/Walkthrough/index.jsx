import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import RevealMnemonic from './RevealMnemonic'
import { Card, Text } from '../../../../Shared'
import WordPrompt from './WordPrompt'
import generateRandomWords from '../../../../../utils/generateRandomWords'

const indexToWord = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  '13th',
  '14th',
  '15th',
  '16th',
  '17th',
  '18th',
  '19th',
  '20th',
  '21st',
  '22nd',
  '23rd',
  '24th'
]

const Stage = ({ mnemonic, setCanContinue, walkthroughStep }) => {
  const randoms = useRef()
  if (!randoms.current) randoms.current = generateRandomWords(mnemonic, 4)
  const [first, second, third, fourth] = randoms.current
  switch (walkthroughStep) {
    case 1:
      return <RevealMnemonic mnemonic={mnemonic} />
    case 2:
      return (
        <WordPrompt
          setCanContinue={setCanContinue}
          wordToMatch={first.word}
          numWord={indexToWord[first.index]}
        />
      )
    case 3:
      return (
        <WordPrompt
          setCanContinue={setCanContinue}
          wordToMatch={second.word}
          numWord={indexToWord[second.index]}
        />
      )
    case 4:
      return (
        <WordPrompt
          setCanContinue={setCanContinue}
          wordToMatch={third.word}
          numWord={indexToWord[third.index]}
        />
      )
    case 5:
      return (
        <WordPrompt
          setCanContinue={setCanContinue}
          wordToMatch={fourth.word}
          numWord={indexToWord[fourth.index]}
        />
      )
    default:
      return <Text>Error, how the hell did you get here?</Text>
  }
}

Stage.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE,
  walkthroughStep: PropTypes.number.isRequired,
  setCanContinue: PropTypes.func.isRequired
}

const Walkthrough = ({ mnemonic, walkthroughStep, setCanContinue }) => {
  return (
    <Card
      width={16}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      borderColor='core.lightgray'
    >
      <Stage
        mnemonic={mnemonic}
        walkthroughStep={walkthroughStep}
        setCanContinue={setCanContinue}
      />
    </Card>
  )
}

Walkthrough.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE,
  walkthroughStep: PropTypes.number.isRequired,
  setCanContinue: PropTypes.func.isRequired
}

export default Walkthrough
