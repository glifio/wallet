import React from 'react'
import PropTypes from 'prop-types'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import Step1 from './Step1'
import { Card, BigTitle } from '../../../../Shared'
import WordPrompt from './WordPrompt'
import generateRandomIndexes from '../../../../../utils/generateRandomIndexes'

const Stage = ({ mnemonic, walkthroughStep }) => {
  const randomIndexes = generateRandomIndexes(mnemonic.split(' ').length, 4)
  switch (walkthroughStep) {
    case 1:
      return <Step1 mnemonic={mnemonic} />
    case 2:
      return <WordPrompt word={mnemonic.split(' ')[randomIndexes[0]]} />
    case 3:
      return <WordPrompt word={mnemonic.split(' ')[randomIndexes[1]]} />
    case 4:
      return <WordPrompt word={mnemonic.split(' ')[randomIndexes[2]]} />
    case 5:
      return <WordPrompt word={mnemonic.split(' ')[randomIndexes[3]]} />
    default:
      return <div>Error, how the hell did you get here?</div>
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
