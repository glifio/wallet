import React from 'react'
import { MsigHome } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const SignerRemove = () => {
  return (
    <RequireWallet>
      <MsigHome />
    </RequireWallet>
  )
}

export default SignerRemove
