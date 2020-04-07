import React from 'react'
import styled from 'styled-components'
import { typography } from 'styled-system'
import PropTypes from 'prop-types'
import { Box, Card, Glyph, Text, Stepper } from '../../Shared'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY
} from '../../../constants'

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
          {' '}
          confirm the transfer on your Ledger device.
        </TextHighlight>
      </Text>
    </>
  )
}

const OtherWalletTypeConfirm = () => {
  return (
    <>
      <Text color='core.nearblack'>
        To complete the transaction, please review the{' '}
        <TextHighlight>recipient</TextHighlight> and{' '}
        <TextHighlight>amount</TextHighlight> and click &rdquo;Confirm&rdquo; at
        the bottom of the page.
      </Text>
      <Text>
        <TextHighlight>Remember:</TextHighlight> Transactions are{' '}
        <TextHighlight>final once sent.</TextHighlight>
      </Text>
    </>
  )
}

const ConfirmationCard = ({ walletType }) => {
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
        alignItems='center'
        justifyContent='space-between'
      >
        <Box display='flex' flexDirection='row' alignItems='center'>
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
        <Box display='flex' alignItems='center'>
          <Stepper
            textColor='card.confirmation.foreground'
            completedDotColor='card.confirmation.foreground'
            incompletedDotColor='core.silver'
            step={2}
            totalSteps={2}
          />
          <Box width={5} mx={2} />
        </Box>
      </Box>
      {walletType === LEDGER ? <LedgerConfirm /> : <OtherWalletTypeConfirm />}
    </Card>
  )
}

ConfirmationCard.propTypes = {
  walletType: PropTypes.oneOf([
    LEDGER,
    IMPORT_MNEMONIC,
    CREATE_MNEMONIC,
    IMPORT_SINGLE_KEY
  ]).isRequired
}

export default ConfirmationCard
