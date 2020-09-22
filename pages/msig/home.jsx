import React from 'react'
import { MsigHome } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

export default () => {
  return (
    <RequireWallet>
      <MsigHome />
    </RequireWallet>
  )
}
