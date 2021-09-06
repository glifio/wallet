import React from 'react'
import styled from 'styled-components'
import { typography } from 'styled-system'
import PropTypes from 'prop-types'
import { Box, Card, Glyph, Text, Stepper } from '@glif/react-components'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY,
  WalletType
} from '../../../constants'
import LoaderGlyph from '../../Shared/LoaderGlyph'

const TextHighlight = styled.span.attrs(() => ({
  fontSize: 'inherit'
}))`
  text-decoration: underline;
  ${typography}
`

type ReplaceStrategy = 'CANCEL' | 'SPEED_UP'

const determineReplacementText = (replaceStrategy: ReplaceStrategy): string => {
  return replaceStrategy === 'CANCEL' ? 'cancel' : 'speed up'
}

const LedgerConfirm = ({
  replaceStrategy
}: {
  replaceStrategy: ReplaceStrategy
}) => {
  return (
    <Text color='core.nearblack'>
      To {determineReplacementText(replaceStrategy)} your pending message,
      please{' '}
      <TextHighlight>sign the message on your Ledger device.</TextHighlight>
    </Text>
  )
}

LedgerConfirm.propTypes = {
  replaceStrategy: PropTypes.oneOf(['CANCEL', 'SPEED_UP'])
}

const OtherWalletTypeConfirm = ({
  replaceStrategy
}: {
  replaceStrategy: 'CANCEL' | 'SPEED_UP'
}) => {
  return (
    <>
      <Text color='core.nearblack'>
        To {determineReplacementText(replaceStrategy)} your pending transaction,
        please confirm below.
      </Text>
    </>
  )
}

OtherWalletTypeConfirm.propTypes = {
  replaceStrategy: PropTypes.oneOf(['CANCEL', 'SPEED_UP'])
}

const ConfirmationCard = ({
  walletType,
  currentStep,
  totalSteps,
  loading,
  replaceStrategy
}: {
  walletType: WalletType
  currentStep: number
  totalSteps: number
  loading: boolean
  replaceStrategy: 'CANCEL' | 'SPEED_UP'
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
            <LedgerConfirm replaceStrategy={replaceStrategy} />
          ) : (
            <OtherWalletTypeConfirm replaceStrategy={replaceStrategy} />
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
  replaceStrategy: PropTypes.oneOf(['CANCEL', 'SPEED_UP'])
}

ConfirmationCard.defaultProps = {
  // defaults fit criteria for normal send flow
  currentStep: 2,
  totalSteps: 2
}

export default ConfirmationCard
