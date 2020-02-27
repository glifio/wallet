import React, { forwardRef } from 'react'
import { string, func, bool } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import Glyph from '../Glyph'
import Button from '../Button'
import { ButtonCopyAccountAddress } from '../IconButtons'
import { BigTitle, Text } from '../Typography'
import truncate from '../../../utils/truncateAddress'

const AccountCard = forwardRef(
  (
    {
      address,
      alias,
      onAccountSwitch,
      isLedgerWallet,
      onShowOnLedger,
      ledgerBusy,
      ...props
    },
    ref
  ) => {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width={11}
        height={11}
        borderRadius={2}
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
          <BigTitle>{alias}</BigTitle>
          <Box display='flex' alignContent='center'>
            <Text margin={0}>{truncate(address)}</Text>
            <ButtonCopyAccountAddress border={0} onClick />
          </Box>
        </Box>
        <Box display='flex'>
          <Button
            buttonStyle='tertiary'
            title='Switch'
            onClick={onAccountSwitch}
            p={2}
          />
          {isLedgerWallet && (
            <Button
              buttonStyle='tertiary'
              title='View on Ledger'
              onClick={onShowOnLedger}
              ml={2}
              p={2}
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
   * Human readable alias of Filecoin address
   */
  alias: string.isRequired,
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
  isLedgerWallet: bool,
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
  isLedgerWallet: false,
  onShowOnLedger: () => {},
  ledgerBusy: false
}

export default AccountCard
