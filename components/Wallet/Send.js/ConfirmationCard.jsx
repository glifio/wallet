import React from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Input, Stepper, Text } from '../../Shared'
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
        <strong>confirm the transfer on your Ledger device.</strong>
      </Text>
    </>
  )
}

const OtherWalletTypeConfirm = ({ toAddress, value }) => {
  return (
    <>
      <Text color='core.nearblack'>Please confirm that you want to:</Text>
      <Input.Text disabled label='SEND' value={value.fil.toFil()} />
      <Input.Address disabled label='to' value={toAddress} />
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
      ml={4}
      mr={4}
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
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            width={6}
            height={6}
            backgroundColor='status.success.background'
          >
            <Text textAlign='center' color='white'>
              Cf
            </Text>
          </Box>
          <Text color='status.success.background' ml={2}>
            Confirmation
          </Text>
        </Box>
        <Stepper
          textColor='status.success.background'
          completedDotColor='status.success.background'
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
  toAddress: ADDRESS_PROPTYPE.isRequired
}

export default ConfirmationCard
