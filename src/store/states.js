import updateArrayItem from './utils/updateArrayItem'

export const initialState = {
  wallets: [],
  selectedWalletIdx: 0,
  error: null,
  pendingMsgs: [],
  confirmedMsgs: [],
  progress: 1,
  walletType: 'LEDGER',
  walletConnected: false
}

export const walletList = (state, { wallets }) => ({
  ...state,
  wallets
})

export const switchWallet = (state, { index }) => ({
  ...state,
  selectedWalletIdx: index
})

export const updateBalance = (state, { balance, selectedWalletIdx }) => ({
  ...state,
  wallets: updateArrayItem(state.wallets, selectedWalletIdx, {
    balance,
    address: state.wallets[selectedWalletIdx].address
  })
})

export const confirmMessage = (state, { message }) => ({
  ...state,
  pendingMsgs: [...state.pendingMsgs, message]
})

export const confirmedMessages = (state, { confirmedMsgs, pendingMsgs }) => {
  return {
    ...state,
    pendingMsgs,
    confirmedMsgs: [...confirmedMsgs, ...state.confirmedMsgs]
  }
}

export const updateProgress = (state, { progress }) => ({
  ...state,
  progress
})

export const setWalletType = (state, { walletType }) => ({
  ...state,
  walletType
})

export const error = (state, error) => ({
  ...state,
  error
})

export const clearError = state => ({
  ...state,
  error: null
})
