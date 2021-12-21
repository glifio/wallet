import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet } from '@glif/wallet-provider-react'
import { MsigChangeSigner, MsigPageWrapper } from '../../components/Msig'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

const ChangeSigner = () => {
  const router = useRouter()
  const address = router.query?.address || ''
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <RequireWallet gatekeep={gatekeep}>
      <MsigPageWrapper hideNav>
        <MsigChangeSigner oldSignerAddress={address} />
      </MsigPageWrapper>
    </RequireWallet>
  )
}

export default ChangeSigner
