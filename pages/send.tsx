import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet } from '@glif/wallet-provider-react'
import { OneColumn } from '@glif/react-components'

import WalletPageLoggedIn from '../components/WalletPageLoggedIn'
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
    <WalletPageLoggedIn>
      <OneColumn>
        <RequireWallet gatekeep={gatekeep}>
          <SendView />
        </RequireWallet>
      </OneColumn>
    </WalletPageLoggedIn>
  )
}

export default Send
