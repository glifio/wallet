import React from 'react'
import PropTypes from 'prop-types'

import { LEDGER, IMPORT_SEED, CREATE, IMPORT_PK } from '../../../constants'
import Ledger from './Ledger'

const Configure = ({ walletType }) => {
  switch (walletType) {
    case CREATE:
      return <div>Create</div>
    case LEDGER:
      return <Ledger />
    case IMPORT_PK:
      return <div>Import pk</div>
    case IMPORT_SEED:
      return <div>Import seed</div>
    default:
      return <div>Error, how the hell did you get here?</div>
  }
}

Configure.propTypes = {
  walletType: PropTypes.oneOf([LEDGER, IMPORT_SEED, CREATE, IMPORT_PK])
    .isRequired
}

export default Configure
