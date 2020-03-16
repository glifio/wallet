import React from 'react'
import PropTypes from 'prop-types'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import RevealMnemonic from './RevealMnemonic'
import { Card, Text } from '../../../../Shared'
import WordPrompt from './WordPrompt'

const Stage = ({ canContinue, mnemonic, setCanContinue, walkthroughStep }) => {
  switch (walkthroughStep) {
    case 1:
      return <RevealMnemonic mnemonic={mnemonic} />
    case 2:
      return (
        <WordPrompt
          canContinue={canContinue}
          setCanContinue={setCanContinue}
          mnemonic={mnemonic}
        />
      )
    case 3:
      return <RevealMnemonic valid mnemonic={mnemonic} />
    default:
      return <Text>Error, how the hell did you get here?</Text>
  }
}

Stage.propTypes = {
  canContinue: PropTypes.bool.isRequired,
  mnemonic: MNEMONIC_PROPTYPE,
  walkthroughStep: PropTypes.number.isRequired,
  setCanContinue: PropTypes.func.isRequired
}

const Walkthrough = ({
  canContinue,
  mnemonic,
  walkthroughStep,
  setCanContinue
}) => {
  return (
    <Card
      width={16}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      borderColor='core.lightgray'
    >
      <Stage
        canContinue={canContinue}
        mnemonic={mnemonic}
        walkthroughStep={walkthroughStep}
        setCanContinue={setCanContinue}
      />
      {walkthroughStep === 3 && !canContinue && (
        <Text color='status.fail.background'>
          One or more of your seed phrase words was incorrect.
        </Text>
      )}
    </Card>
  )
}

Walkthrough.propTypes = {
  canContinue: PropTypes.bool.isRequired,
  mnemonic: MNEMONIC_PROPTYPE,
  walkthroughStep: PropTypes.number.isRequired,
  setCanContinue: PropTypes.func.isRequired
}

export default Walkthrough
