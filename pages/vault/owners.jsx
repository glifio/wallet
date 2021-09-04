import React from 'react'
import { MsigHome } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const Owners = () => {
  return (
    <RequireWallet>
      {/* TODO: Replace with MsigOwners */}
      <MsigHome />
    </RequireWallet>
  )
}

export default Owners
