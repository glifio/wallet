import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@glif/react-components'
import { LEDGER, WalletType } from '../../../constants'

const HeaderText = ({
  step,
  walletType,
  expertMode
}: {
  step: number,
  walletType: WalletType,
  expertMode: boolean,
}) => {
  let text = ''

  // todo. Make a shared component and consolidate with /components/Wallet/Send.js ?

  // todo: do we need a custom version for ledger?
  //  if (walletType === LEDGER)
  //       text = 'Please confirm the transaction on your Ledger device.'

  switch (step) {
    case 1: {
      if (expertMode) text = 'Please adjust the fields and click save to see your new maximum transaction fee.'
      else text = 'Please review the new maximum transaction fee. You will not pay more than this amount.'
    }
      break
    case 2:
      text = "When you're ready, send the replaced transaction."
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
  walletType: PropTypes.string.isRequired,
  expertMode: PropTypes.bool.isRequired
}

export default HeaderText
