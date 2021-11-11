import { FilecoinNumber } from '@glif/filecoin-number'
import { useWalletProvider } from '../'
import { Wallet } from '../types'

const noWallet: Wallet = {
  address: '',
  balance: new FilecoinNumber('0', 'fil'),
  path: ''
}

export default function useWallet() {
  const { wallets, selectedWalletIdx } = useWalletProvider()

  if (wallets.length === 0) return noWallet
  if (!wallets[selectedWalletIdx]) return noWallet
  return wallets[selectedWalletIdx]
}
