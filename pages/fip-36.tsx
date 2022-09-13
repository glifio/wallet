import {
  navigate,
  OneColumnCentered,
  RequireWallet
} from '@glif/react-components'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Fip } from '../components/Fip'
import WalletPageLoggedIn from '../components/WalletPageLoggedIn'
import { PAGE } from '../constants'

export default function Fip36() {
  const router = useRouter()
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <WalletPageLoggedIn>
      <RequireWallet gatekeep={gatekeep}>
        <OneColumnCentered>
          <Fip />
        </OneColumnCentered>
      </RequireWallet>
    </WalletPageLoggedIn>
  )
}
