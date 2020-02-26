import React, { forwardRef } from 'react'
import { string, func } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import Glyph from '../Glyph'
import Button from '../Button'
import { ButtonCopyAccountAddress } from '../IconButtons'
import { BigTitle, Text } from '../Typography'

const truncate = text => `${text.slice(0, 4)}...${text.slice(-4)}`

const AccountCard = forwardRef(
  ({ address, alias, onAccountSwitch, ...props }, ref) => (
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
          <ButtonCopyAccountAddress size={7} border={0} />
        </Box>
      </Box>
      <Box display='flex'>
        <Button
          buttonStyle='tertiary'
          title='Switch'
          onClick={onAccountSwitch}
          p={2}
        />
        <Button
          buttonStyle='tertiary'
          title='View on Ledger'
          onClick={onAccountSwitch}
          ml={2}
          p={2}
        />
      </Box>
    </Box>
  )
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
  onAccountSwitch: func.isRequired
}

AccountCard.defaultProps = {
  color: 'white'
}

AccountCard.displayName = 'AccountCard'

export default AccountCard
