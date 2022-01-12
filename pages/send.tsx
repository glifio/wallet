import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet } from '@glif/wallet-provider-react'

import SendView from '../components/Wallet/Send'
import { navigate } from '../utils/urlParams'
import { PAGE } from '../constants'

const Send = () => {
  const router = useRouter()

  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <RequireWallet gatekeep={gatekeep}>
      <SendView />
    </RequireWallet>
  )
}

export default Send
