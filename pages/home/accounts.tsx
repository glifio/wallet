import { useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  AccountSelector,
  RequireWallet,
  OneColumn,
  navigate
} from '@glif/react-components'

import WalletPageLoggedIn from '../../components/WalletPageLoggedIn'
import { PAGE } from '../../constants'

const Accounts = () => {
  const router = useRouter()
  const onSelectAccount = useCallback(
    () => navigate(router, { pageUrl: PAGE.WALLET_HOME }),
    [router]
  )
  const gatekeep = useCallback(
    () => navigate(router, { pageUrl: PAGE.LANDING }),
    [router]
  )
  return (
    <WalletPageLoggedIn>
      <OneColumn>
        <RequireWallet gatekeep={gatekeep}>
          <AccountSelector
            title='Switch Accounts'
            helperText='Your connected wallet creates hundreds of individual accounts. Each account can be used to send and receive $FIL.'
            onSelectAccount={onSelectAccount}
            showSelectedAccount
          />
        </RequireWallet>
      </OneColumn>
    </WalletPageLoggedIn>
  )
}

export default Accounts
