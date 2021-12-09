import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import type { LoginOption } from '@glif/filecoin-wallet-provider'

import {
  LEDGER,
  IMPORT_MNEMONIC,
  IMPORT_SINGLE_KEY,
  CREATE_MNEMONIC
} from '../../../constants'

const Create = dynamic(() => import('./Create'))
const Ledger = dynamic(() => import('./Ledger'))
const ImportPrivateKey = dynamic(() => import('./ImportPrivateKey'))
const ImportMnemonic = dynamic(() => import('./ImportMnemonic'))

const Configure = ({ loginOption }: { loginOption: LoginOption }) => {
  switch (loginOption) {
    case CREATE_MNEMONIC:
      return <Create initialWalkthroughStep={1} />
    case LEDGER:
      return <Ledger msig={false} />
    case IMPORT_SINGLE_KEY:
      return <ImportPrivateKey />
    case IMPORT_MNEMONIC:
      return <ImportMnemonic />
    default:
      return <div>Error, how the hell did you get here?</div>
  }
}

Configure.propTypes = {
  loginOption: PropTypes.oneOf([
    LEDGER,
    IMPORT_MNEMONIC,
    CREATE_MNEMONIC,
    IMPORT_SINGLE_KEY
  ]).isRequired
}

export default Configure
