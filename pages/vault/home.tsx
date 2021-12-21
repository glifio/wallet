import { useCallback } from 'react'
import { RequireWallet } from '@glif/wallet-provider-react'
import { useRouter } from 'next/router'

import { MsigHome } from '../../components/Msig'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

const Home = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <RequireWallet gatekeep={gatekeep}>
      <MsigHome />
    </RequireWallet>
  )
}

export default Home
