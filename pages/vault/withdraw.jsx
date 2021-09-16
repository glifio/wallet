import React from 'react'
import { MsigWithdraw } from '../../components/Msig'
import { MsigPageWrapper } from '../../components/Msig/Shared'
import RequireWallet from '../../lib/RequireWallet'

const Withdraw = () => {
  return (
    <RequireWallet>
      <MsigPageWrapper hideNav>
        <MsigWithdraw />
      </MsigPageWrapper>
    </RequireWallet>
  )
}

export default Withdraw
