import { useSelector } from 'react-redux'

export const useWallet = () => {
  return useSelector(state => {
    if (state.wallets.length === 0) return null
    if (!state.wallets[state.selectedWalletIdx]) return null
    return state.wallets[state.selectedWalletIdx]
  })
}

export const useSomething = () => {}
