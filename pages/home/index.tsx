import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet } from '@glif/wallet-provider-react'
import { OneColumn } from '@glif/react-components'

import WalletPageLoggedIn from '../../components/WalletPageLoggedIn'
import { WalletView } from '../../components'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

const Home = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <WalletPageLoggedIn>
      <OneColumn>
        <RequireWallet gatekeep={gatekeep}>
          <WalletView />
        </RequireWallet>
      </OneColumn>
    </WalletPageLoggedIn>
  )
}

export default Home
