import React from 'react'
import { MsigHome } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const Withdraw = () => {
  return (
    <RequireWallet>
      <MsigHome />
    </RequireWallet>
  )
}

export default Withdraw
