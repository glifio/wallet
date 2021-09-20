import { useRouter } from 'next/router'
import React from 'react'
import { MsigChangeSigner, MsigPageWrapper } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const ChangeSigner = () => {
  const { query } = useRouter()
  const address = query?.address || ''

  return (
    <RequireWallet>
      <MsigPageWrapper hideNav>
        <MsigChangeSigner oldSignerAddress={address} />
      </MsigPageWrapper>
    </RequireWallet>
  )
}

export default ChangeSigner
