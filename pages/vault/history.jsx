import React from 'react'
import { MsigHome } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const History = () => {
  return (
    <RequireWallet>
      {/* TODO: Replace with MsigHistory */}
      <MsigHome />
    </RequireWallet>
  )
}

export default History
