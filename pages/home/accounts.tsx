import { CoinType } from '@glif/filecoin-address'
import { AccountSelector, RequireWallet } from '@glif/wallet-provider-react'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { PAGE } from '../../constants'
import { navigate } from '../../utils/urlParams'

const COIN_TYPE = process.env.COIN_TYPE! as CoinType
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
    <RequireWallet gatekeep={gatekeep}>
      <AccountSelector
        title='Switch Accounts'
        helperText={`Your connected wallet creates hundreds of individual accounts. We're showing you the first ${nWalletsToShow}.`}
        onSelectAccount={onSelectAccount}
        nWalletsToLoad={nWalletsToShow}
        coinType={COIN_TYPE}
        showSelectedAccount
      />
    </RequireWallet>
  )
}

export default Accounts
