import React from 'react'
import styled from 'styled-components'
import { typography } from 'styled-system'
import PropTypes from 'prop-types'
import { Box, Card, Glyph, Text } from '../../Shared'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY
} from '../../../constants'
import {
  FILECOIN_NUMBER_PROP,
  ADDRESS_PROPTYPE
} from '../../../customPropTypes'

const TextHighlight = styled.span.attrs(() => ({
  fontSize: 3,
  fontWeight: 2
}))`
  ${typography}
`

const LedgerConfirm = () => {
  return (
    <>
      <Text color='core.nearblack'>
        To send the transaction, please
        <TextHighlight>
          confirm the transfer on your Ledger device.
        </TextHighlight>
      </Text>
    </>
  )
}

const OtherWalletTypeConfirm = ({ toAddress, value }) => {
  return (
    <>
      <Text color='core.nearblack'>
        To send the transaction, please review the
        <TextHighlight>recipient</TextHighlight> and
        <TextHighlight>amount</TextHighlight> and click the Confirm button at
        the bottom of the page.
      </Text>
      <Text>Remember: You cannot undo this transaction once you send it.</Text>
    </>
  )
}

OtherWalletTypeConfirm.propTypes = {
  value: PropTypes.shape({
    fil: FILECOIN_NUMBER_PROP
  }).isRequired,
  toAddress: ADDRESS_PROPTYPE
}

const ConfirmationCard = ({ value, walletType, toAddress }) => {
  return (
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      border='none'
      width='auto'
      my={2}
      bg='card.confirmation.background'
    >
      <Box
        display='flex'
        flexDirection='row'
        border='none'
        width='auto'
        justifyContent='space-between'
      >
        <Box display='flex' alignItems='center'>
          <Glyph
            acronym='Cf'
            textAlign='center'
            color='card.confirmation.background'
            borderColor='card.confirmation.foreground'
            backgroundColor='card.confirmation.foreground'
          />
          <Text color='card.confirmation.foreground' ml={2}>
            Confirmation
          </Text>
        </Box>
      </Box>
      {walletType === LEDGER ? (
        <LedgerConfirm />
      ) : (
        <OtherWalletTypeConfirm value={value} toAddress={toAddress} />
      )}
    </Card>
  )
}

ConfirmationCard.propTypes = {
  value: PropTypes.shape({
    fil: FILECOIN_NUMBER_PROP
  }).isRequired,
  walletType: PropTypes.oneOf([
    LEDGER,
    IMPORT_MNEMONIC,
    CREATE_MNEMONIC,
    IMPORT_SINGLE_KEY
  ]).isRequired,
  toAddress: ADDRESS_PROPTYPE
}

export default ConfirmationCard
