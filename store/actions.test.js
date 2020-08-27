import { Message } from '@openworklabs/filecoin-message'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import * as actions from './actions'
import * as types from './actionTypes'
import { MAINNET } from '../constants'

describe('actions', () => {
  test('walletList', () => {
    const wallets = [
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: ''
      }
    ]

    const expectedAction = {
      type: types.WALLET_LIST,
      payload: {
        wallets
      }
    }

    expect(actions.walletList(wallets)).toEqual(expectedAction)
  })

  test('switchWallet', () => {
    const index = 1
    const expectedAction = {
      type: types.SWITCH_WALLET,
      payload: {
        index
      }
    }

    expect(actions.switchWallet(index)).toEqual(expectedAction)
  })

  test('updateBalance', () => {
    const walletIdx = 1
    const balance = new FilecoinNumber('1', 'fil')
    const expectedAction = {
      type: types.UPDATE_BALANCE,
      payload: {
        balance,
        walletIdx
      }
    }

    expect(actions.updateBalance(balance, walletIdx)).toEqual(expectedAction)
  })

  test('confirmMessage', () => {
    const message = new Message({
      from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
      to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
      value: '1000',
      method: 0,
      nonce: 0
    })
    const expectedAction = {
      type: types.CONFIRM_MESSAGE,
      payload: {
        message
      }
    }

    expect(actions.confirmMessage(message)).toEqual(expectedAction)
  })

  test('confirmedMessage', () => {
    const msgCid = 'Qmv'

    const expectedAction = {
      type: types.CONFIRMED_MESSAGE,
      payload: {
        msgCid
      }
    }

    expect(actions.confirmedMessage(msgCid)).toEqual(expectedAction)
  })

  test('fetchingConfirmedMessages', () => {
    expect(actions.fetchingConfirmedMessages()).toEqual({
      type: types.FETCHING_CONFIRMED_MESSAGES
    })
  })

  test('fetchedConfirmedMessagesSuccess', () => {
    const messages = [
      new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 0
      }).toLotusType()
    ]

    const total = 1

    const expectedAction = {
      type: types.FETCHED_CONFIRMED_MESSAGES_SUCCESS,
      payload: {
        messages,
        total
      }
    }
    expect(actions.fetchedConfirmedMessagesSuccess(messages, total)).toEqual(
      expectedAction
    )
  })

  test('fetchedConfirmedMessagesFailure', () => {
    const err = new Error()
    const expectedAction = {
      type: types.FETCHED_CONFIRMED_MESSAGES_FAILURE,
      error: err
    }

    expect(actions.fetchedConfirmedMessagesFailure(err)).toEqual(expectedAction)
  })

  test('fetchingNextPage', () => {
    expect(actions.fetchingNextPage()).toEqual({
      type: types.FETCHING_NEXT_PAGE
    })
  })

  test('error', () => {
    const err = new Error()
    const expectedAction = {
      type: types.ERROR,
      error: err
    }

    expect(actions.error(err)).toEqual(expectedAction)
  })

  test('clearError', () => {
    expect(actions.clearError()).toEqual({ type: types.CLEAR_ERROR })
  })

  test('populateRedux', () => {
    const pendingMsgs = [
      new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 0
      })
    ]

    const expectedAction = {
      type: types.POPULATE_REDUX,
      payload: {
        pendingMsgs
      }
    }

    expect(actions.populateRedux(pendingMsgs)).toEqual(expectedAction)
  })

  test('switchNetwork', () => {
    const network = MAINNET
    const wallets = [
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: ''
      }
    ]

    const expectedAction = {
      type: types.SWITCH_NETWORK,
      payload: {
        network,
        wallets
      }
    }

    expect(actions.switchNetwork(network, wallets)).toEqual(expectedAction)
  })

  test('resetState', () => {
    expect(actions.resetState()).toEqual({ type: types.RESET_STATE })
  })
})
