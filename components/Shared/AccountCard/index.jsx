import React, { forwardRef, useState } from 'react'
import { string, func, bool } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import Glyph from '../Glyph'
import Button from '../Button'
import { BigTitle, Text } from '../Typography'

const truncate = text => `${text.slice(0, 4)}...${text.slice(-4)}`

const AccountCard = forwardRef(
  (
    {
      address,
      alias,
      onAccountSwitch,
      isLedgerWallet,
      onShowOnLedger,
      ...props
    },
    ref
  ) => {
    const [isViewingOnLedger, setIsViewingOnLedger] = useState(false)
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
          <Text margin={0}>{truncate(address)}</Text>
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
              onClick={async () => {
                setIsViewingOnLedger(true)
                await onShowOnLedger()
                setIsViewingOnLedger(false)
              }}
              ml={2}
              p={2}
              disabled={isViewingOnLedger}
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
  onShowOnLedger: func
}

AccountCard.defaultProps = {
  color: 'white',
  isLedgerWallet: false,
  onShowOnLedger: () => {}
}

export default AccountCard
