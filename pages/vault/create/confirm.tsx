import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet } from '@glif/wallet-provider-react'
import ConfirmMsgCreate from '../../../components/Msig/Create/Confirm'
import { navigate } from '../../../utils/urlParams'
import { PAGE } from '../../../constants'

const Confirm = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <RequireWallet gatekeep={gatekeep}>
      <ConfirmMsgCreate />
    </RequireWallet>
  )
}

export default Confirm
