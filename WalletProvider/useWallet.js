import { useSelector } from 'react-redux'
import { useWalletProvider } from '.'

export default () => {
  const { walletType } = useWalletProvider()
  const wallet = useSelector(state => {
    if (state.wallets.length === 0) return null
    if (!state.wallets[state.selectedWalletIdx]) return null
    return state.wallets[state.selectedWalletIdx]
  })

  return { ...wallet, type: walletType }
}
