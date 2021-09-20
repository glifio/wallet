import React from 'react'
import { MsigAdmin } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const Owners = () => {
  return (
    <RequireWallet>
      <MsigAdmin />
    </RequireWallet>
  )
}

export default Owners
