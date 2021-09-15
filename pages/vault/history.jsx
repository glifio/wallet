import React from 'react'
import { MsigHistory } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const History = () => {
  return (
    <RequireWallet>
      <MsigHistory />
    </RequireWallet>
  )
}

export default History
