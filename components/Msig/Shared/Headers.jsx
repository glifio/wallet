import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text, Glyph, StyledATag } from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import truncateAddress from '../../../utils/truncateAddress'

export const CardHeader = ({ address, balance }) => {
  return (
    <Box
      width='100%'
      p={3}
      border={0}
      borderTopRightRadius={3}
      borderTopLeftRadius={3}
      bg='core.primary'
      color='core.white'
    >
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box display='flex' flexDirection='row' alignItems='center'>
          <Glyph acronym='Ms' color='white' mr={3} />
          <Box display='flex' flexDirection='column' alignItems='flex-start'>
            <Text m={0}>From</Text>
            <Text m={0}>{truncateAddress(address)}</Text>
          </Box>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='flex-start'>
          <Text m={0}>Balance</Text>
          <Text m={0}>{makeFriendlyBalance(balance, 6, true)} FIL</Text>
        </Box>
      </Box>
    </Box>
  )
}

CardHeader.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP
}

export const WithdrawHeaderText = ({ step }) => {
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
      text =
        'Please review transaction fee details. Please note, the transaction fee is paid from the Filecoin wallet on your Ledger device, not your multisig wallet.'
      break
    case 4:
      text = 'Please review the transaction details.'
      break
    default:
      text = ''
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Text textAlign='center'>{text}</Text>
      <StyledATag
        width='auto'
        href='https://reading.supply/@glif/how-to-use-the-glif-vault-after-mainnet-launches-Td1ErO'
      >
        Click here for our guided Filecoin Vault tutorial.
      </StyledATag>
    </Box>
  )
}

WithdrawHeaderText.propTypes = {
  step: PropTypes.number.isRequired
}

export const ChangeOwnerHeaderText = ({ step }) => {
  let text = ''

  switch (step) {
    case 2:
      text =
        'Please input the new Filecoin address you want to be the owner of your multisig wallet.'
      break
    case 3:
      text = 'Please review the transaction details.'
      break
    default:
      text = ''
  }
  return <Text textAlign='center'>{text}</Text>
}

ChangeOwnerHeaderText.propTypes = {
  step: PropTypes.number.isRequired
}

export const TakeCustodyHeaderText = ({ step }) => {
  let text = ''

  switch (step) {
    case 2:
      text =
        'Please input the new Filecoin address you want to be the owner of your multisig wallet.'
      break
    case 3:
      text = 'Please review the transaction details.'
      break
    default:
      text = ''
  }
  return <Text textAlign='center'>{text}</Text>
}

TakeCustodyHeaderText.propTypes = {
  step: PropTypes.number.isRequired
}
