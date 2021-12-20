import React from 'react'
import styled from 'styled-components'
import { typography } from 'styled-system'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  Glyph,
  Text,
  Stepper,
  StyledATag,
  Loading as LoaderGlyph
} from '@glif/react-components'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY
} from '../../../constants'

const TextHighlight = styled.span.attrs(() => ({
  fontSize: 'inherit'
}))`
  text-decoration: underline;
  ${typography}
`

const LedgerConfirm = ({ msig }) => {
  return (
    <>
      <Text color='core.nearblack'>
        To send the transaction, please{' '}
        <TextHighlight>
          confirm the transfer on your Ledger device.
        </TextHighlight>
      </Text>
      {msig && (
        <StyledATag
          width='fit-content'
          fontSize={2}
          display='inline-block'
          target='_blank'
          rel='noopener noreferrer'
          href='https://reading.supply/@glif/what-to-look-for-on-your-ledger-device-when-submitting-a-multi-sig-transaction-gQXIX6'
        >
          What should I see on my Ledger device?
        </StyledATag>
      )}
    </>
  )
}

LedgerConfirm.propTypes = {
  msig: PropTypes.bool.isRequired
}

const OtherWalletTypeConfirm = () => {
  return (
    <>
      <Text color='core.nearblack'>
        To complete the transaction, please review the{' '}
        <TextHighlight>recipient</TextHighlight> and{' '}
        <TextHighlight>amount</TextHighlight> and click &rdquo;Send&rdquo; at
        the bottom of the page.
      </Text>
      <Text>
        <TextHighlight>Remember:</TextHighlight> Transactions are{' '}
        <TextHighlight>final once sent.</TextHighlight>
      </Text>
    </>
  )
}

const ConfirmationCard = ({
  walletType,
  currentStep,
  totalSteps,
  loading,
  msig
}) => {
  return (
    <>
      {loading ? (
        <Card
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          border='none'
          width='auto'
          my={2}
        >
          <LoaderGlyph />
          <Text ml={3}>Loading...</Text>
        </Card>
      ) : (
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
                step={currentStep}
                totalSteps={totalSteps}
              />
            </Box>
          </Box>
          {walletType === LEDGER ? (
            <LedgerConfirm msig={msig} />
          ) : (
            <OtherWalletTypeConfirm />
          )}
        </Card>
      )}
    </>
  )
}

ConfirmationCard.propTypes = {
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  walletType: PropTypes.oneOf([
    LEDGER,
    IMPORT_MNEMONIC,
    CREATE_MNEMONIC,
    IMPORT_SINGLE_KEY
  ]).isRequired,
  loading: PropTypes.bool.isRequired,
  msig: PropTypes.bool
}

ConfirmationCard.defaultProps = {
  // defaults fit criteria for normal send flow
  currentStep: 2,
  totalSteps: 2,
  msig: false
}

export default ConfirmationCard
