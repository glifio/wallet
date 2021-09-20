import { useRouter } from 'next/router'
import React from 'react'
import { RemoveSigner } from '../../components/Msig'
import { MsigPageWrapper } from '../../components/Msig/Shared'
import RequireWallet from '../../lib/RequireWallet'

const Remove = () => {
  const { query } = useRouter()
  const address = query?.address || ''
  return (
    <RequireWallet>
      <MsigPageWrapper hideNav>
        <RemoveSigner signerAddress={address} />
      </MsigPageWrapper>
    </RequireWallet>
  )
}

export default Remove
