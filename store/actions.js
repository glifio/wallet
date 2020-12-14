import LotusRpcEngine from '@glif/filecoin-rpc-client'
import {
  CONFIRM_MESSAGE,
  CONFIRMED_MESSAGE,
  ERROR,
  SWITCH_WALLET,
  SWITCH_NETWORK,
  UPDATE_BALANCE,
  CLEAR_ERROR,
  CLEAR_MESSAGES,
  FETCHING_CONFIRMED_MESSAGES,
  FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  FETCHED_CONFIRMED_MESSAGES_FAILURE,
  FETCHING_NEXT_PAGE,
  WALLET_LIST,
  POPULATE_REDUX,
  RESET_STATE,
  SET_INVESTOR_ID,
  SET_MSIG_ACTOR_ADDRESS
} from './actionTypes'
import getAddressFromReceipt from '../utils/getAddrFromReceipt'

export const walletList = wallets => ({
  type: WALLET_LIST,
  payload: {
    wallets
  }
})

export const switchWallet = index => ({
  type: SWITCH_WALLET,
  payload: {
    index
  }
})

export const updateBalance = (balance, walletIdx = 0) => ({
  type: UPDATE_BALANCE,
  payload: {
    balance,
    walletIdx
  }
})

export const confirmMessage = message => ({
  type: CONFIRM_MESSAGE,
  payload: {
    message
  }
})

export const confirmedMessage = msgCid => ({
  type: CONFIRMED_MESSAGE,
  payload: {
    msgCid
  }
})

export const clearMessages = () => ({
  type: CLEAR_MESSAGES
})

export const fetchingConfirmedMessages = () => ({
  type: FETCHING_CONFIRMED_MESSAGES
})

export const fetchedConfirmedMessagesSuccess = (messages, total) => ({
  type: FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  payload: {
    messages,
    total
  }
})

export const fetchedConfirmedMessagesFailure = error => ({
  type: FETCHED_CONFIRMED_MESSAGES_FAILURE,
  error
})

export const fetchingNextPage = () => ({
  type: FETCHING_NEXT_PAGE
})

export const error = err => ({
  type: ERROR,
  error: err
})

export const clearError = () => {
  return {
    type: CLEAR_ERROR
  }
}

export const populateRedux = pendingMsgs => ({
  type: POPULATE_REDUX,
  payload: {
    pendingMsgs
  }
})

export const switchNetwork = (network, wallets = []) => ({
  type: SWITCH_NETWORK,
  payload: {
    network,
    wallets
  }
})

export const resetState = () => {
  return {
    type: RESET_STATE
  }
}

export const setInvestorId = uuid => {
  return {
    type: SET_INVESTOR_ID,
    payload: {
      uuid
    }
  }
}

export const setMsigActor = msigActorAddress => {
  return {
    type: SET_MSIG_ACTOR_ADDRESS,
    payload: {
      msigActorAddress
    }
  }
}

export const fetchAndSetMsigActor = msgCid => {
  return async dispatch => {
    const lCli = new LotusRpcEngine({
      apiAddress: process.env.LOTUS_NODE_JSONRPC
    })
    const receipt = await lCli.request('StateGetReceipt', { '/': msgCid }, null)
    if (receipt.ExitCode === 0) {
      dispatch(setMsigActor(getAddressFromReceipt(receipt.Return)))
    } else {
      dispatch(
        error(
          'There was an error when creating, confirming, or fetching your multisig actor.'
        )
      )
    }
  }
}
