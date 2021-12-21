import React, { useCallback } from 'react'
import { RequireWallet } from '@glif/wallet-provider-react'
import { useRouter } from 'next/router'

import { MsigWithdraw } from '../../components/Msig'
import { MsigPageWrapper } from '../../components/Msig/Shared'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

const Withdraw = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <RequireWallet gatekeep={gatekeep}>
      <MsigPageWrapper hideNav>
        <MsigWithdraw />
      </MsigPageWrapper>
    </RequireWallet>
  )
}

export default Withdraw
