import React from 'react'
import { AddSigner } from '../../components/Msig'
import { MsigPageWrapper } from '../../components/Msig/Shared'
import RequireWallet from '../../lib/RequireWallet'

const Add = () => {
  return (
    <RequireWallet>
      <MsigPageWrapper hideNav>
        <AddSigner />
      </MsigPageWrapper>
    </RequireWallet>
  )
}

export default Add
