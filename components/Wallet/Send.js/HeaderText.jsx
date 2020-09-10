import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '../../Shared'
import { LEDGER } from '../../../constants'

const HeaderText = ({ step, customizingGas, walletType }) => {
  let text = ''

  switch (step) {
    case 1:
      text =
        "First, please confirm the account you're sending from, and the recipient you want to send to."
      break
    case 2:
      text = "Next, please choose an amount of FIL you'd like to withdraw."
      break
    case 3:
      text = 'Please review the transaction details.'
      break
    case 4:
      if (walletType === LEDGER)
        text = 'Please confirm the transaction on your Ledger device.'
      else text = 'Click Send at the bottom to send your Filecoin message.'
      break
    default:
      text = ''
  }

  if (customizingGas)
    text = 'Please select the custom gas fee for this transaction.'

  return <Text textAlign='center'>{text}</Text>
}

HeaderText.propTypes = {
  step: PropTypes.number.isRequired,
  customizingGas: PropTypes.bool.isRequired,
  walletType: PropTypes.string.isRequired
}

export default HeaderText
