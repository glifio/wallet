import updateArrayItem from './utils/updateArrayItem'

export const initialState = {
  wallets: [],
  selectedWalletIdx: 5,
  error: null,
  messages: {
    page: 0,
    loading: false,
    loadedSuccess: false,
    loadedFailure: false,
    pending: [],
    confirmed: [],
    links: {},
    paginating: false
  },
  progress: 3
}

export const walletList = (state, { wallets }) => ({
  ...state,
  wallets,
  selectedWalletIdx: 5
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

export const fetchingConfirmedMessages = state => ({
  ...state,
  messages: {
    ...state.messages,
    loading: true,
    loadedSuccess: false,
    loadedFailure: false
  }
})

export const fetchedConfirmedMessagesSuccess = (
  state,
  { messages, links }
) => ({
  ...state,
  messages: {
    ...state.messages,
    loading: false,
    loadedSuccess: true,
    loadedFailure: false,
    confirmed: messages,
    links
  }
})

export const fetchedConfirmedMessagesFailure = (state, error) => ({
  ...state,
  messages: {
    ...state.messages,
    loading: false,
    loadedSuccess: false,
    loadedFailure: true
  },
  error
})

export const fetchingNextPage = state => ({
  ...state,
  messages: {
    ...state.messages,
    paginating: true
  }
})

export const fetchedNextPageSuccess = (state, { messages, links }) => ({
  ...state,
  messages: {
    ...state.messages,
    paginating: false,
    confirmed: [...state.messages.confirmed, ...messages],
    links
  }
})

export const fetchedNextPageFailure = (state, error) => ({
  ...state,
  messages: {
    ...state.messages,
    paginating: false
  },
  error
})

export const error = (state, error) => ({
  ...state,
  error
})

export const clearError = state => ({
  ...state,
  error: null
})
