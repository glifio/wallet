import React from 'react'
import PropTypes from 'prop-types'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import RevealMnemonic from './RevealMnemonic'
import { Text } from '../../../../Shared'
import WordPrompt from './WordPrompt'

const Walkthrough = ({
  canContinue,
  importSeedError,
  mnemonic,
  walkthroughStep,
  setCanContinue
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
