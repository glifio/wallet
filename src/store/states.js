import Filecoin, {
  LocalNodeProvider
} from '@openworklabs/filecoin-wallet-provider'
import updateArrayItem from './utils/updateArrayItem'
import BigNumber from 'bignumber.js'

export const initialState = {
  wallets: [
    {
      address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
      balance: new BigNumber('0')
    }
  ],
  selectedWalletIdx: 0,
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
  progress: 2,
  walletType: 'import',
  walletConnected: false,
  walletProvider: new Filecoin(
    new LocalNodeProvider({
      apiAddress: 'https://lotus-dev.temporal.cloud/rpc/v0',
      token: process.env.REACT_APP_LOTUS_JWT_TOKEN
    }),
    {
      token: process.env.REACT_APP_LOTUS_JWT_TOKEN
    }
  )
}

export const walletList = (state, { wallets }) => ({
  ...state,
  wallets
})

export const switchWallet = (state, { index }) => ({
  ...state,
  selectedWalletIdx: index
})

export const updateBalance = (state, { balance, walletIdx }) => ({
  ...state,
  wallets: updateArrayItem(state.wallets, walletIdx, {
    balance,
    address: state.wallets[walletIdx].address
  })
})

export const confirmMessage = (state, { message }) => {
  return {
    ...state,
    messages: {
      ...state.messages,
      pending: [message, ...state.messages.pending]
    }
  }
}

export const confirmedMessage = (state, { msgCid }) => {
  let newPendingMsgs = [...state.messages.pending]
  let confirmedMsg = []

  for (let i = 0; i < state.messages.pending.length; i++) {
    if (state.messages.pending[i].cid === msgCid) {
      confirmedMsg = newPendingMsgs.splice(i, 1)
    }
  }

  return {
    ...state,
    messages: {
      ...state.messages,
      pending: newPendingMsgs,
      confirmed: [...confirmedMsg, ...state.messages.confirmed]
    }
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
export const setWalletType = (state, { walletType }) => ({
  ...state,
  walletType
})

export const createWalletProvider = (state, { provider }) => ({
  ...state,
  walletConnected: true,
  walletProvider: provider
})

export const error = (state, error) => ({
  ...state,
  error
})

export const clearError = state => ({
  ...state,
  error: null
})

export const populateRedux = (state, { confirmedMsgs, pendingMsgs }) => ({
  ...state,
  messages: {
    ...state.messages,
    // just in case there's some crazy race condition where msgs were loaded from server before localstorage
    confirmed: [...confirmedMsgs, ...state.messages.confirmed],
    pendingg: pendingMsgs
  }
})
