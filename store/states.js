/* eslint-disable no-unused-vars */
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import updateArrayItem from '../utils/updateArrayItem'
import sortAndRemoveWalletDups from '../utils/sortAndRemoveWalletDups'
import { setMsgInCache, removeMsgFromCache } from './cache'

export const initialMessagesState = {
  loading: false,
  loadedSuccess: false,
  loadedFailure: false,
  pending: [
    {
      cid: 'bafy2bzdcecudvhr2s3qsktbvowylx4l5jatusjxrgabvo6q7bjmywvr36io6a',
      from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
      to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
      value: '1000',
      method: 0,
      gasprice: '1',
      gaslimit: '1000',
      gas_used: '122',
      nonce: 0,
      timestamp: '1585942380'
    }
  ],
  confirmed: [],
  paginating: false,
  total: -1
}

export const initialState = {
  wallets: [],
  selectedWalletIdx: -1,
  error: null,
  messages: initialMessagesState,
  network: 't'
}

export const noWallet = {
  address: '',
  balance: new FilecoinNumber('0', 'fil'),
  path: ''
}

export const walletList = (state, { wallets }) => ({
  ...state,
  // make sure we only ever add wallets to our list that include the right network prefix (blocks race conditions with ledger)
  wallets: sortAndRemoveWalletDups(
    state.wallets,
    wallets.filter(wallet => wallet.address[0] === state.network)
  ),
  selectedWalletIdx: state.selectedWalletIdx >= 0 ? state.selectedWalletIdx : 0
})

export const switchWallet = (state, { index }) => ({
  ...state,
  selectedWalletIdx: index,
  messages: initialMessagesState
})

export const updateBalance = (state, { balance, walletIdx }) => ({
  ...state,
  wallets: updateArrayItem(state.wallets, walletIdx, {
    ...state.wallets[walletIdx],
    balance
  })
})

export const confirmMessage = (state, { message }) => {
  // setMsgInCache(message)
  return {
    ...state,
    messages: {
      ...state.messages,
      pending: [message, ...state.messages.pending]
    }
  }
}

export const confirmedMessage = (state, { msgCid }) => {
  // const { address } = state.wallets[state.selectedWalletIdx]
  // removeMsgFromCache(address, msgCid)
  const newPendingMsgs = [...state.messages.pending]
  let confirmedMsg = []

  for (let i = 0; i < state.messages.pending.length; i += 1) {
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
  { messages, total }
) => ({
  ...state,
  messages: {
    ...state.messages,
    loading: false,
    loadedSuccess: true,
    loadedFailure: false,
    confirmed: [...state.messages.confirmed, ...messages],
    total: total || state.messages.total,
    paginating: false
  }
})

export const fetchedConfirmedMessagesFailure = (state, error) => ({
  ...state,
  messages: {
    ...state.messages,
    loading: false,
    loadedSuccess: false,
    loadedFailure: true,
    paginating: false
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

export const error = (state, err) => ({
  ...state,
  error: err
})

export const clearError = state => ({
  ...state,
  error: null
})

export const populateRedux = (state, { pendingMsgs }) => ({
  ...state,
  messages: {
    ...state.messages,
    // just in case there's some crazy race condition where msgs were loaded from server before localstorage
    pending: pendingMsgs
  }
})

export const switchNetwork = (state, { network, wallets }) => ({
  ...state,
  network,
  wallets,
  messages: initialMessagesState
})
