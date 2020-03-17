import React from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Input, Glyph, Stepper, Text } from '../../Shared'
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

const LedgerConfirm = () => {
  return (
    <>
      <Text color='core.nearblack'>Thank you.</Text>
      <Text color='core.nearblack'>
        To send the transaction,{' '}
        <span
          css={`
            font-size: 1.25rem;
            font-weight: 600;
          `}
        >
          confirm the transfer on your Ledger device.
        </span>
      </Text>
    </>
  )
}

const OtherWalletTypeConfirm = ({ toAddress, value }) => {
  return (
    <>
      <Text color='core.nearblack'>Please confirm that you want to:</Text>
      <Input.Text
        disabled
        backgroundColor='card.confirmation.background'
        color='card.confirmation.foreground'
        label='Sending'
        value={value.fil.toFil()}
      />
      <Input.Address
        disabled
        backgroundColor='card.confirmation.background'
        color='card.confirmation.foreground'
        label='To'
        value={toAddress}
      />
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
        <Stepper
          textColor='card.confirmation.foreground'
          completedDotColor='card.confirmation.foreground'
          incompletedDotColor='core.silver'
          step={2}
          totalSteps={2}
        >
          Step 2
        </Stepper>
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
