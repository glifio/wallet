import Filecoin, { LedgerProvider } from '@glif/filecoin-wallet-provider'
import { CoinType } from '@glif/filecoin-address'
import { LEDGER } from '../constants'
import { clearError } from './state'
import createPath, { coinTypeCode } from '../utils/createPath'
import connectWithLedger from './connectLedger'
import { LoginOption, WalletProviderAction } from './types'
import { Dispatch } from 'react'

const COIN_TYPE = process.env.COIN_TYPE! as CoinType

// a helper function for getting the default wallet associated with the wallet provider
const fetchDefaultWallet = async (
  dispatch: Dispatch<WalletProviderAction>,
  loginOption: LoginOption,
  walletProvider: Filecoin
) => {
  dispatch(clearError())
  let provider = walletProvider
  if (loginOption === LEDGER) {
    provider = await connectWithLedger(
      dispatch,
      walletProvider.wallet as LedgerProvider
    )
  }

  const [defaultAddress] = await provider.wallet.getAccounts(0, 1, COIN_TYPE)
  const balance = await provider.getBalance(defaultAddress)
  let path = createPath(coinTypeCode(COIN_TYPE), 0)

  if (loginOption === 'IMPORT_SINGLE_KEY') path = ''
  return {
    balance,
    address: defaultAddress,
    path
  }
}

export default fetchDefaultWallet
