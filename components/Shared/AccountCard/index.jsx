import React, { forwardRef } from 'react'
import { string, func, bool, oneOf } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import Glyph from '../Glyph'
import Button from '../Button'
import { CopyAddress } from '../Copy'
import { Text } from '../Typography'
import {
  LEDGER,
  CREATE_MNEMONIC,
  IMPORT_MNEMONIC,
  IMPORT_SINGLE_KEY
} from '../../../constants'

const AccountCard = forwardRef(
  (
    {
      address,
      onAccountSwitch,
      onShowOnLedger,
      ledgerBusy,
      walletType,
      ...props
    },
    ref
  ) => {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width='300px'
        height='300px'
        borderRadius={3}
        p={3}
        color='card.account.color'
        bg='card.account.background'
        boxShadow={1}
        ref={ref}
        {...props}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          color='card.account.color'
        >
          <Glyph mr={3} color='card.account.color' acronym='Ac' />
          <Text>Account</Text>
        </Box>
        <Box color='card.account.color'>
          <Text m={0}>Your Address</Text>
          <CopyAddress address={address} />
        </Box>
        <Box display='flex'>
          {walletType !== IMPORT_SINGLE_KEY && (
            <Button
              variant='tertiary'
              title='Switch'
              onClick={onAccountSwitch}
              height='max-content'
              p={2}
              py={2}
            />
          )}
          {walletType === LEDGER && (
            <Button
              variant='tertiary'
              title={ledgerBusy ? 'Check Device' : 'Show on Device'}
              onClick={onShowOnLedger}
              height='max-content'
              ml={2}
              p={2}
              py={2}
              disabled={ledgerBusy}
            />
          )}
        </Box>
      </Box>
    )
  }
)

AccountCard.propTypes = {
  /**
   * Filecoin address
   */
  address: ADDRESS_PROPTYPE,
  /**
   * Sets background-color of the card
   */
  color: string,
  /**
   * Fired when the "switch" button is clicked
   */
  onAccountSwitch: func.isRequired,
  /**
   * If this wallet represents a ledger
   */
  walletType: oneOf([
    LEDGER,
    CREATE_MNEMONIC,
    IMPORT_MNEMONIC,
    IMPORT_SINGLE_KEY
  ]).isRequired,
  /**
   * If this wallet represents a ledger, the function that gets called when "show on Ledger" button gets clicked
   */
  onShowOnLedger: func,
  /**
   * When true, disable the show on ledger button
   */
  ledgerBusy: bool
}

AccountCard.defaultProps = {
  color: 'white',
  onShowOnLedger: () => {},
  ledgerBusy: false
}

export default AccountCard
