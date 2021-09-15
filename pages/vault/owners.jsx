import React from 'react'
import { MsigOwners } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const Owners = () => {
  return (
    <RequireWallet>
      <MsigOwners />
    </RequireWallet>
  )
}

export default Owners
