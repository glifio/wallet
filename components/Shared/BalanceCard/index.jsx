import React, { forwardRef, useState } from 'react'
import { func, bool } from 'prop-types'
import { BigNumber, FilecoinNumber } from '@openworklabs/filecoin-number'
import { converter } from '../../../utils/cmcConverter'
import Box from '../Box'
import Button from '../Button'
import { BigTitle, Title, Label } from '../Typography'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

// this component will also be responsible for fetching the fiat denominated amount of the balance
const BalanceCard = forwardRef(
  ({ balance, onSend, onReceive, disableButtons, ...props }, ref) => (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      width='300px'
      minHeight='300px'
      border={1}
      borderRadius={2}
      p={3}
      bg='card.balance.background'
      ref={ref}
      {...props}
    >
      <Label>Balance</Label>
      <Box overflow='hidden'>
        <BigTitle color='card.balance.color'>
          {makeFriendlyBalance(new BigNumber(balance.toFil()))} FIL
        </BigTitle>
        <Title color='card.balance.color'>
          {makeFriendlyBalance(
            new BigNumber(converter.fromFIL(balance.toFil()))
          )}{' '}
          USD
        </Title>
      </Box>
      <Box display='flex' justifyContent='space-between'>
        <Button
          variant='secondary'
          title='Receive'
          disabled={disableButtons}
          onClick={onReceive}
          width={120}
        />
        <Button
          variant='primary'
          title='Send'
          disabled={disableButtons}
          onClick={onSend}
          ml={2}
          width={120}
        />
      </Box>
    </Box>
  )
)

BalanceCard.propTypes = {
  /**
   * users balance in Filecoin denom
   */
  balance: FILECOIN_NUMBER_PROP,
  /**
   * action fired when send button is clicked
   */
  onSend: func.isRequired,
  /**
   * action fired when receive button is clicked
   */
  onReceive: func.isRequired,
  /**
   * determines if the buttons should be disabled or not
   */
  disableButtons: bool
}

BalanceCard.defaultProps = {
  disableButtons: false
}

export default BalanceCard
