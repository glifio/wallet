import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '../../Shared'
import { LEDGER } from '../../../constants'

const HeaderText = ({ step, walletType }) => {
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
      text = 'Next, please review the transaction fee.'
      break
    case 4:
      text = 'Please review the transaction details.'
      break
    case 5:
      if (walletType === LEDGER)
        text = 'Please confirm the transaction on your Ledger device.'
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
