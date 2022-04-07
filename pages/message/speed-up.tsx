import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { RequireWallet } from '@glif/wallet-provider-react'
import { OneColumnCentered } from '@glif/react-components'

import WalletPageLoggedIn from '../../components/WalletPageLoggedIn'
import { Replace, ReplaceStrategy } from '../../components/Wallet/Replace'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

const SpeedUpPage = () => {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <WalletPageLoggedIn>
      <OneColumnCentered>
        <RequireWallet gatekeep={gatekeep}>
          <Replace strategy={ReplaceStrategy.SPEED_UP} />
        </RequireWallet>
      </OneColumnCentered>
    </WalletPageLoggedIn>
  )
}

export default SpeedUpPage
