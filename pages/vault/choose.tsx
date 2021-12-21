import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet } from '@glif/wallet-provider-react'

import EnterOrCreateActor from '../../components/Msig/EnterOrCreateActor'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

const Choose = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <RequireWallet gatekeep={gatekeep}>
      <EnterOrCreateActor />
    </RequireWallet>
  )
}

export default Choose
