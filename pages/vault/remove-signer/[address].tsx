import React from 'react'
import { RemoveSigner } from '../../../components/Msig'
import RequireWallet from '../../../lib/RequireWallet'

const SignerRemoveWithCid = () => {
  return (
    <RequireWallet>
      <RemoveSigner />
    </RequireWallet>
  )
}

export default SignerRemoveWithCid
