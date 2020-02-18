import React from 'react'
import PropTypes from 'prop-types'

import {
  LEDGER,
  IMPORT_MNEMONIC,
  IMPORT_SINGLE_KEY,
  CREATE_MNEMONIC
} from '../../../constants'
import Ledger from './Ledger'

const Configure = ({ walletType }) => {
  switch (walletType) {
    case CREATE_MNEMONIC:
      return <div>Create</div>
    case LEDGER:
      return <Ledger />
    case IMPORT_SINGLE_KEY:
      return <div>Import pk</div>
    case IMPORT_MNEMONIC:
      return <div>Import seed</div>
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
