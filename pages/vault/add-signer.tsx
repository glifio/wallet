import React from 'react'
import { AddSigner } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const SignerAdd = () => {
  return (
    <RequireWallet>
      <AddSigner />
    </RequireWallet>
  )
}

export default SignerAdd
