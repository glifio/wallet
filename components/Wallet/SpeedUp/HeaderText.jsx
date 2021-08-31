import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '../../Shared'
import { LEDGER } from '../../../constants'

const HeaderText = ({ step, walletType }) => {
  let text = ''

  // todo. Make a shared component and consolidate with /components/Wallet/Send.js ?

  // todo: do we need a custom version for ledger?
  //  if (walletType === LEDGER)
  //       text = 'Please confirm the transaction on your Ledger device.'

  switch (step) {
    case 1:
      text = 'Please review the transaction details.'
      break
    case 2:
      text = '...'
      break
    default:
      text = ''
  }

  return (
    <Text m={0} textAlign='center'>
      {text}
    </Text>
  )
}

HeaderText.propTypes = {
  step: PropTypes.number.isRequired,
  walletType: PropTypes.string.isRequired
}

export default HeaderText
