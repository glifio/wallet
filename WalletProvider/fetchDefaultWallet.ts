import Filecoin from '@glif/filecoin-wallet-provider'
import { CoinType } from '@glif/filecoin-address'
import { SINGLE_KEY, LEDGER } from '../constants'
import { clearError } from './state'
import createPath, { coinTypeCode } from '../utils/createPath'
import connectWithLedger from './connectLedger'

const COIN_TYPE = process.env.COIN_TYPE! as CoinType

// a helper function for getting the default wallet associated with the wallet provider
const fetchDefaultWallet = async (
  dispatch,
  walletType,
  walletProvider: Filecoin
) => {
  dispatch(clearError())
  let provider = walletProvider
  if (walletType === LEDGER) {
    provider = await connectWithLedger(dispatch)
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
