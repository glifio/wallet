import { useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  OneColumnCentered,
  RequireWallet,
  navigate
} from '@glif/react-components'

import WalletPageLoggedIn from '../components/WalletPageLoggedIn'
import { Send } from '../components/Wallet/Send'
import { PAGE } from '../constants'

const SendPage = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <WalletPageLoggedIn>
      <OneColumnCentered>
        <RequireWallet gatekeep={gatekeep}>
          <Send />
        </RequireWallet>
      </OneColumnCentered>
    </WalletPageLoggedIn>
  )
}

export default SendPage
