import { useSelector } from 'react-redux'
import { useWalletProvider } from '.'
import { noWallet } from '../store/states'

export default () => {
  const { walletType } = useWalletProvider()
  const { wallet, selectedWalletIdx } = useSelector(state => {
    if (state.wallets.length === 0)
      return { wallet: noWallet, selectedWalletIdx: -1 }
    if (!state.wallets[state.selectedWalletIdx])
      return { wallet: noWallet, selectedWalletIdx: -1 }
    return {
      wallet: state.wallets[state.selectedWalletIdx],
      selectedWalletIdx: state.selectedWalletIdx
    }
  })

  return {
    ...wallet,
    type: walletType,
    index: selectedWalletIdx
  }
}
