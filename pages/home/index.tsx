import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet, navigate } from '@glif/react-components'

import WalletPageLoggedIn from '../../components/WalletPageLoggedIn'
import { WalletView } from '../../components'
import { PAGE } from '../../constants'

const Home = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <WalletPageLoggedIn>
      <RequireWallet gatekeep={gatekeep}>
        <WalletView />
      </RequireWallet>
    </WalletPageLoggedIn>
  )
}

export default Home
