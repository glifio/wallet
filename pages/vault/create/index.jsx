import React from 'react'
import RequireWallet from '../../../lib/RequireWallet'
import { CreateMsig, MsigPageWrapper } from '../../../components/Msig'

const Create = () => {
  return (
    <RequireWallet>
      <MsigPageWrapper hideNav>
        <CreateMsig />
      </MsigPageWrapper>
    </RequireWallet>
  )
}

export default Create
