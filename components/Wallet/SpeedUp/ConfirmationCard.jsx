import React from 'react'
import styled from 'styled-components'
import { typography } from 'styled-system'
import PropTypes from 'prop-types'
import { Box, Card, Glyph, Text, Stepper, StyledATag } from '../../Shared'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY
} from '../../../constants'
import LoaderGlyph from '../../Shared/LoaderGlyph'

const TextHighlight = styled.span.attrs(() => ({
  fontSize: 'inherit'
}))`
  text-decoration: underline;
  ${typography}
`

const LedgerConfirm = ({ msig }) => {
  return (
    <>
      {/* Todo: update this similar to /components/Wallet/Send.js/ConfirmationCard.jsx  */}
    </>
  )
}

LedgerConfirm.propTypes = {
  msig: PropTypes.bool.isRequired
}

const OtherWalletTypeConfirm = () => {
  return (
    <>
      {/* /Todo: update this similar to /components/Wallet/Send.js/ConfirmationCard.jsx */}
      <Text color='core.nearblack'>
        To complete the transaction, please review the ...
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
            {
              /* Todo: update this similar to /components/Wallet/Send.js/ConfirmationCard.jsx */
            }
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
