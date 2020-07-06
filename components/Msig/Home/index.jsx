import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMsig } from '../../../MsigProvider'
import Balances from '../Balances'
import Withdrawing from '../Withdrawing'
import { Box, FloatingContainer, Button } from '../../Shared'

const MSIG_STATE = 'MSIG_STATE'
const WITHDRAWING = 'WITHDRAWING'

export default () => {
  const msigActorAddress = useSelector(state => state.msigActorAddress)
  const msig = useMsig(msigActorAddress)
  const [childView, setChildView] = useState(MSIG_STATE)
  return (
    <>
      {/* <FloatingContainer>
        <Button variant='secondary' title='Cancel' />
        <Button variant='primary' title='Next' />
      </FloatingContainer> */}
      <Box p={3}>
        {childView === MSIG_STATE && (
          <Balances
            address={msigActorAddress}
            available={msig.AvailableBalance}
            total={msig.Balance}
            setWithdrawing={() => setChildView(WITHDRAWING)}
          />
        )}
        {childView === WITHDRAWING && (
          <Withdrawing
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
      </Box>
    </>
  )
}
