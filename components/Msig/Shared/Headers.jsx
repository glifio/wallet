import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text, Glyph } from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import truncateAddress from '../../../utils/truncateAddress'

export const CardHeader = ({ address, balance, customizingGas }) => {
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
          {customizingGas ? (
            <>
              <Glyph acronym='Tf' color='white' mr={3} />
              <Text m={0}>Custom transaction fee</Text>
            </>
          ) : (
            <>
              <Glyph acronym='Ms' color='white' mr={3} />
              <Box
                display='flex'
                flexDirection='column'
                alignItems='flex-start'
              >
                <Text m={0}>From</Text>
                <Text m={0}>{truncateAddress(address)}</Text>
              </Box>
            </>
          )}
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
  balance: FILECOIN_NUMBER_PROP,
  customizingGas: PropTypes.bool.isRequired
}

export const WithdrawHeaderText = ({ step, customizingGas }) => {
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
    default:
      text = ''
  }

  if (customizingGas)
    text = 'Please select the custom gas fee for this transaction.'

  return <Text textAlign='center'>{text}</Text>
}

WithdrawHeaderText.propTypes = {
  step: PropTypes.number.isRequired,
  customizingGas: PropTypes.bool.isRequired
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
