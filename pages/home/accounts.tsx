import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { CoinType } from '@glif/filecoin-address'
import {
  AccountSelector,
  RequireWallet,
  OneColumn
} from '@glif/react-components'

import WalletPageLoggedIn from '../../components/WalletPageLoggedIn'
import { PAGE } from '../../constants'
import { navigate } from '../../utils/urlParams'

const COIN_TYPE = process.env.NEXT_PUBLIC_COIN_TYPE! as CoinType
const IS_PROD = process.env.NEXT_PUBLIC_IS_PROD
const nWalletsToShow = 5

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
            helperText={`Your connected wallet creates hundreds of individual accounts. We're showing you the first ${nWalletsToShow}.`}
            onSelectAccount={onSelectAccount}
            nWalletsToLoad={nWalletsToShow}
            coinType={COIN_TYPE}
            showSelectedAccount
            isProd={!!IS_PROD}
          />
        </RequireWallet>
      </OneColumn>
    </WalletPageLoggedIn>
  )
}

export default Accounts
