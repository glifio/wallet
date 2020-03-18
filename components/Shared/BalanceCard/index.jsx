import React, { forwardRef } from 'react'
import { func, bool } from 'prop-types'
// import { BigNumber } from '@openworklabs/filecoin-number'
import Box from '../Box'
import Button from '../Button'
import { HugeNumber, BigNumber, Title, Label } from '../Typography'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import { useConverter } from '../../../lib/Converter'

const BalanceCard = forwardRef(
  ({ balance, onSend, onReceive, disableButtons, ...props }, ref) => {
    const { converter, converterError } = useConverter()
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width='300px'
        minHeight='300px'
        border={1}
        borderRadius={3}
        p={3}
        bg='card.balance.background'
        ref={ref}
        {...props}
      >
        <Label>Balance</Label>
        <Box overflow='hidden'>
          <HugeNumber color='card.balance.color'>
            {makeFriendlyBalance(balance, 5)}FIL
          </HugeNumber>
          {!converter && !converterError ? (
            <BigNumber color='core.darkgray'>Loading USD</BigNumber>
          ) : (
            <BigNumber color='core.darkgray'>
              {makeFriendlyBalance(converter.fromFIL(balance.toFil()))}
              USD
            </BigNumber>
          )}
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
  }
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
