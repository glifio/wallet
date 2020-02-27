import React, { forwardRef } from 'react'
import { string, func, bool } from 'prop-types'
import Box from '../Box'
import Button from '../Button'
import { BigTitle, Title, Label } from '../Typography'

// this component will also be responsible for fetching the fiat denominated amount of the balance
const BalanceCard = forwardRef(
  ({ balance, onSend, onReceive, disableButtons, ...props }, ref) => (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      width={11}
      height={11}
      border={1}
      borderRadius={2}
      p={3}
      bg='card.balance.background'
      ref={ref}
      {...props}
    >
      <Label>Balance</Label>
      <Box overflow='hidden'>
        <BigTitle color='card.balance.color'>{balance}FIL</BigTitle>
        {/* @alex this will change to be dynamically created, for now just pretend 1 FIL = 5 USD */}
        <Title color='card.balance.color'>{Number(balance) * 5}USD</Title>
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
  balance: string.isRequired,
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
