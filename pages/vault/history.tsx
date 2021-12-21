import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet } from '@glif/wallet-provider-react'
import { MsigHistory } from '../../components/Msig'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

const History = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <RequireWallet gatekeep={gatekeep}>
      <MsigHistory />
    </RequireWallet>
  )
}

export default History
