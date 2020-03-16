import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

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

const Configure = ({ walletType }) => {
  switch (walletType) {
    case CREATE_MNEMONIC:
      return <Create />
    case LEDGER:
      return <Ledger />
    case IMPORT_SINGLE_KEY:
      return <ImportPrivateKey />
    case IMPORT_MNEMONIC:
      return <ImportMnemonic />
    default:
      return <div>Error, how the hell did you get here?</div>
  }
}

Configure.propTypes = {
  walletType: PropTypes.oneOf([
    LEDGER,
    IMPORT_MNEMONIC,
    CREATE_MNEMONIC,
    IMPORT_SINGLE_KEY
  ]).isRequired
}

export default Configure
