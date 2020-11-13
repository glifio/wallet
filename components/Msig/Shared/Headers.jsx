import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text, Glyph, StyledATag } from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import truncateAddress from '../../../utils/truncateAddress'

export const CardHeader = ({ address, msigBalance, signerBalance, msig }) => {
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
        {msig ? (
          <Box display='flex' flexDirection='row'>
            <Box
              display='flex'
              flexDirection='column'
              alignItems='flex-start'
              mr={3}
            >
              <Text m={0}>Ledger Balance</Text>
              <Text m={0}>
                {makeFriendlyBalance(signerBalance, 6, true)} FIL
              </Text>
            </Box>
            <Box display='flex' flexDirection='column' alignItems='flex-start'>
              <Text m={0}>Msig Balance</Text>
              <Text m={0}>{makeFriendlyBalance(msigBalance, 6, true)} FIL</Text>
            </Box>
          </Box>
        ) : (
          <Box display='flex' flexDirection='column' alignItems='flex-start'>
            <Text m={0}>Balance</Text>
            <Text m={0}>{makeFriendlyBalance(signerBalance, 6, true)} FIL</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}

CardHeader.propTypes = {
  address: ADDRESS_PROPTYPE,
  signerBalance: FILECOIN_NUMBER_PROP,
  msigBalance: FILECOIN_NUMBER_PROP,
  msig: PropTypes.bool
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
      text =
        'Please review the transaction fee details. If the fee is too high, please come back and try again later.'
      break
    default:
      text = ''
  }
  return (
    <>
      <Text textAlign='center'>
        Your Ledger Address pays the transaction fee.
      </Text>
      <Text textAlign='center'>{text}</Text>
    </>
  )
}

ChangeOwnerHeaderText.propTypes = {
  step: PropTypes.number.isRequired
}

export const RemoveSignerHeaderText = ({ step }) => {
  let text = ''

  switch (step) {
    case 2:
      text =
        'Please review the transaction fee details. If the fee is too high, please come back and try again later.'
      break
    default:
      text = ''
  }
  return (
    <>
      <Text textAlign='center'>
        Your Ledger Address pays the transaction fee.
      </Text>
      <Text textAlign='center'>{text}</Text>
    </>
  )
}

RemoveSignerHeaderText.propTypes = {
  step: PropTypes.number.isRequired
}

export const AddSignerHeaderText = ({ step }) => {
  let text = ''

  switch (step) {
    case 2:
      text = 'Please enter the Filecoin address of the new signer.'
      break
    case 3:
      text =
        'Please review the transaction fee details. If the fee is too high, please come back and try again later.'
      break
    default:
      text = ''
  }
  return (
    <>
      <Text textAlign='center'>
        Your Ledger Address pays the transaction fee.
      </Text>
      <Text textAlign='center'>{text}</Text>
    </>
  )
}

AddSignerHeaderText.propTypes = {
  step: PropTypes.number.isRequired
}

export const AddRmSignerHeaderText = ({ method, step }) => {
  if (method === 5) return <AddSignerHeaderText step={step} />
  if (method === 6) return <RemoveSignerHeaderText step={step} />
}

AddRmSignerHeaderText.propTypes = {
  method: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired
}
