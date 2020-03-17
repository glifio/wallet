import React from 'react'
import PropTypes from 'prop-types'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import RevealMnemonic from './RevealMnemonic'
import { Card, Text } from '../../../../Shared'
import WordPrompt from './WordPrompt'

const Stage = ({
  canContinue,
  importSeedError,
  mnemonic,
  setCanContinue,
  walkthroughStep
}) => {
  switch (walkthroughStep) {
    case 1:
      return <RevealMnemonic mnemonic={mnemonic} />
    case 2:
      return (
        <WordPrompt
          importSeedError={importSeedError}
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
  setCanContinue: PropTypes.func.isRequired,
  importSeedError: PropTypes.bool.isRequired
}

const Walkthrough = ({
  canContinue,
  importSeedError,
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
        importSeedError={importSeedError}
        mnemonic={mnemonic}
        walkthroughStep={walkthroughStep}
        setCanContinue={setCanContinue}
      />
      {importSeedError && (
        <Text color='status.fail.background'>
          One or more of your seed phrase words was incorrect.
        </Text>
      )}
    </Card>
  )
}

Walkthrough.propTypes = {
  canContinue: PropTypes.bool.isRequired,
  importSeedError: PropTypes.bool,
  mnemonic: MNEMONIC_PROPTYPE,
  walkthroughStep: PropTypes.number.isRequired,
  setCanContinue: PropTypes.func.isRequired
}

Walkthrough.defaultProps = {
  importSeedError: false
}

export default Walkthrough
