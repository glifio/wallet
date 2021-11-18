import Filecoin from '@glif/filecoin-wallet-provider'
import { Network as CoinType } from '@glif/filecoin-address'
import { SINGLE_KEY, LEDGER } from '../constants'
import {
  checkLedgerConfiguration,
  LedgerSubProvider,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'
import createPath, { coinTypeCode } from '../utils/createPath'

const COIN_TYPE = process.env.COIN_TYPE! as CoinType

// a helper function for getting the default wallet associated with the wallet provider
const fetchDefaultWallet = async (
  dispatch,
  walletType,
  walletProvider: Filecoin,
  walletSubProviders
) => {
  dispatch(clearError())
  let provider = walletProvider
  if (walletType === LEDGER) {
    dispatch(resetLedgerState())
    provider = await setLedgerProvider(
      dispatch,
      // this arg gets passed in because we need the variables in its scope
      // see prepareSubproviders to look at the closed over variables
      walletSubProviders.LedgerProvider
    )
    if (!provider) return null
    const configured = await checkLedgerConfiguration(
      dispatch,
      provider as Filecoin & { wallet: LedgerSubProvider }
    )
    if (!configured) return null
  }

  const [defaultAddress] = await provider.wallet.getAccounts(0, 1, COIN_TYPE)
  const balance = await provider.getBalance(defaultAddress)
  let path = createPath(coinTypeCode(COIN_TYPE), 0)

  if (walletType === SINGLE_KEY) path = SINGLE_KEY
  return {
    balance,
    address: defaultAddress,
    path
  }
}

export default fetchDefaultWallet
