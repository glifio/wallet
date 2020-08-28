import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { Message } from '@openworklabs/filecoin-message'
import clonedeep from 'lodash.clonedeep'
import * as states from './states'
import { SINGLE_KEY, MAINNET } from '../constants'
import createPath from '../utils/createPath'

describe('state manipulators', () => {
  // implicitly tests state mutations
  const initialState = Object.freeze(states.initialState)
  describe('walletList', () => {
    test('it adds wallets to redux store', () => {
      const wallets = [
        {
          address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        },
        {
          address: 't1jalfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        }
      ]

      const expectedState = {
        ...initialState,
        selectedWalletIdx: 0,
        wallets
      }

      expect(
        JSON.stringify(states.walletList(initialState, { wallets }))
      ).toEqual(JSON.stringify(expectedState))
    })
    test('it does not add wallets on the wrong network to the store', () => {
      const walletsWithMixedNetworks = [
        {
          address: 'f1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        },
        {
          address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        }
      ]

      const expectedState = {
        ...initialState,
        selectedWalletIdx: 0,
        wallets: [walletsWithMixedNetworks[1]]
      }

      expect(
        states.walletList(initialState, {
          wallets: walletsWithMixedNetworks
        })
      ).toEqual(expectedState)
    })

    test('it keeps the selectedWalletIdx if one is already set', () => {
      const wallets = [
        {
          address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        },
        {
          address: 't1jdlfl73voafblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        }
      ]

      const newInitialState = clonedeep({
        ...initialState,
        selectedWalletIdx: 3
      })

      const expectedState = {
        ...initialState,
        selectedWalletIdx: 3,
        wallets
      }

      expect(states.walletList(newInitialState, { wallets })).toEqual(
        expectedState
      )
    })

    test('it adds the wallets to store when some already exist', () => {
      const existingWallets = [
        {
          address: 't1zdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        },
        {
          address: 't1jflfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        }
      ]

      const newWallets = [
        {
          address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        },
        {
          address: 't1jdlfl73voaiblsvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        }
      ]

      const newInitialState = clonedeep({
        ...initialState,
        wallets: existingWallets
      })

      const expectedState = {
        ...initialState,
        selectedWalletIdx: 0,
        wallets: [...existingWallets, ...newWallets]
      }

      expect(
        states.walletList(newInitialState, { wallets: newWallets })
      ).toEqual(expectedState)
    })

    test('it removes wallet duplicates', () => {
      const dupWallets = [
        {
          address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        },
        {
          address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: SINGLE_KEY
        }
      ]

      const newInitialState = clonedeep({
        ...initialState,
        wallets: dupWallets
      })

      const expectedState = {
        ...initialState,
        selectedWalletIdx: 0,
        wallets: [dupWallets[0]]
      }

      expect(
        states.walletList(newInitialState, { wallets: dupWallets })
      ).toEqual(expectedState)
    })

    test('it sorts HD wallets based on their paths', () => {
      const unsortedWallets = [
        {
          address: 't3jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: createPath(1, 3)
        },
        {
          address: 't0jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: createPath(1, 0)
        },
        {
          address: 't2jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: createPath(1, 2)
        },
        {
          address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: createPath(1, 1)
        }
      ]

      const { wallets } = states.walletList(initialState, {
        wallets: unsortedWallets
      })

      const sorted = wallets
        .map(w => w.path.split('/')[5])
        .every((val, i, arr) => !i || val >= arr[i - 1])

      expect(sorted).toEqual(true)
    })
  })

  describe('switchWallet', () => {
    test('it updates the selected wallet index in state', () => {
      const selectedWalletIdx = 1
      const expectedState = { ...initialState, selectedWalletIdx }
      expect(
        states.switchWallet(initialState, { index: selectedWalletIdx })
      ).toEqual(expectedState)
    })

    test('it resets the messages in state to initialMessageState', () => {
      const selectedWalletIdx = 1
      const newInitialState = {
        ...initialState,
        messages: {
          loading: false,
          loadedSuccess: true,
          loadedFailure: false,
          pending: [],
          confirmed: [],
          paginating: false,
          total: 0
        }
      }

      const { messages } = states.switchWallet(newInitialState, {
        index: selectedWalletIdx
      })
      expect(messages).toEqual(states.initialMessagesState)
    })
  })

  describe('updateBalance', () => {
    test('it updates the balance of the wallet at walletIdx', () => {
      const walletIdx = 1
      const wallets = [
        {
          address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: ''
        },
        {
          address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: ''
        }
      ]

      const newBalance = new FilecoinNumber('2', 'fil')

      const expectedState = {
        ...initialState,
        wallets: [
          {
            address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: ''
          },
          {
            address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: newBalance,
            path: ''
          }
        ]
      }

      expect(
        JSON.stringify(
          states.updateBalance(
            { ...initialState, wallets },
            { balance: newBalance, walletIdx }
          )
        )
      ).toEqual(JSON.stringify(expectedState))
    })
  })

  describe('confirmMessage', () => {
    test('it adds new message to pending message array', () => {
      const message = new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 0
      })

      expect(
        JSON.stringify(states.confirmMessage(initialState, { message }))
      ).toEqual(
        JSON.stringify({
          ...initialState,
          messages: { ...states.initialMessagesState, pending: [message] }
        })
      )
    })

    test('it adds the message to the front of the pending msg array', () => {
      const firstPendingMsg = new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 0
      })
      const secondPendingMsg = new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 1
      })
      const stateWPendingMsg = {
        ...initialState,
        messages: {
          ...states.initialMessagesState,
          pending: [firstPendingMsg]
        }
      }

      const expectedNextState = {
        ...initialState,
        messages: {
          ...states.initialMessagesState,
          pending: [secondPendingMsg, firstPendingMsg]
        }
      }

      expect(
        JSON.stringify(
          states.confirmMessage(stateWPendingMsg, { message: secondPendingMsg })
        )
      ).toEqual(JSON.stringify(expectedNextState))
    })
  })

  describe('confirmedMessage', () => {
    test('it removes the pending message and adds it to the confirmed message arr', () => {
      const message = new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 0
      })
      const msgCid = '123'
      message.cid = msgCid

      const secondMsg = new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 1
      })
      secondMsg.cid = '456'

      const state = {
        ...initialState,
        messages: { ...initialState.messages, pending: [message, secondMsg] }
      }

      const expectedNextState = {
        ...initialState,
        messages: {
          ...initialState.messages,
          confirmed: [message],
          pending: [secondMsg]
        }
      }

      expect(
        JSON.stringify(states.confirmedMessage(state, { msgCid }))
      ).toEqual(JSON.stringify(expectedNextState))
    })

    test('it adds the confirmed message to the front of the confirmed message array', () => {
      const message = new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 0
      })
      const msgCid = '123'
      message.cid = msgCid

      const confirmedMsg = new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 1
      })
      confirmedMsg.cid = '456'

      const state = {
        ...initialState,
        messages: {
          ...initialState.messages,
          confirmed: [confirmedMsg],
          pending: [message]
        }
      }

      const expectedNextState = {
        ...initialState,
        messages: {
          ...initialState.messages,
          confirmed: [message, confirmedMsg],
          pending: []
        }
      }

      expect(
        JSON.stringify(states.confirmedMessage(state, { msgCid }))
      ).toEqual(JSON.stringify(expectedNextState))
    })

    test('it works with large pending msg arrays', () => {
      const pendingMsgs = []
      for (let i = 0; i < 10; i += 1) {
        const message = new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: i
        })

        message.cid = `Qmz${i}`
        pendingMsgs.push(message)
      }

      const state = {
        ...initialState,
        messages: {
          ...initialState.messages,
          pending: pendingMsgs
        }
      }

      const msgCid = 'Qmz5'

      const nextState = states.confirmedMessage(state, { msgCid })
      expect(nextState.messages.pending.length).toBe(pendingMsgs.length - 1)
      expect(nextState.messages.confirmed.length).toBe(1)
    })
  })

  describe('fetchingConfirmedMessages', () => {
    test('it sets the loading states properly', () => {
      const { messages } = states.fetchingConfirmedMessages(initialState)

      expect(messages.loading).toBe(true)
      expect(messages.loadedSuccess).toBe(false)
      expect(messages.loadedFailure).toBe(false)
    })

    test('it does not change the state of paginating', () => {
      const { messages } = states.fetchingConfirmedMessages(initialState)
      expect(messages.paginating).toBe(false)

      const nextStateAlt = states.fetchingConfirmedMessages({
        ...initialState,
        messages: { ...initialState.messages, paginating: true }
      })
      expect(nextStateAlt.messages.paginating).toBe(true)
    })

    test('it keeps messages that were previously in state, in state', () => {
      const pending = [
        new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: 1
        })
      ]
      const confirmed = [
        new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: 0
        })
      ]

      const state = {
        ...initialState,
        messages: { ...initialState.messages, pending, confirmed }
      }

      const nextState = states.fetchingConfirmedMessages(state)
      expect(nextState.messages.pending.length).toBe(1)
      expect(nextState.messages.confirmed.length).toBe(1)
    })
  })

  describe('fetchedConfirmedMessagesSuccess', () => {
    const messagesFromAPI = []
    beforeAll(() => {
      for (let i = 0; i < 10; i += 1) {
        const message = new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: i
        })

        message.cid = `Qmz${i}`
        messagesFromAPI.push(message)
      }
    })

    test('it keeps pending messages that were previously in state, in state', () => {
      const pending = [
        new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: 1
        })
      ]

      const state = {
        ...initialState,
        messages: { ...initialState.messages, pending }
      }

      const nextState = states.fetchedConfirmedMessagesSuccess(state, {
        messages: messagesFromAPI,
        total: 99
      })
      expect(nextState.messages.pending.length).toBe(1)
    })

    test('it adds the new messages to the end of confirmed message array', () => {
      const msg = new Message({
        from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
        to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
        value: '1000',
        method: 0,
        nonce: 1
      })
      msg.cid = 'Qmz11'
      const previouslyConfirmed = [msg]

      const state = {
        ...initialState,
        messages: { ...initialState.messages, confirmed: previouslyConfirmed }
      }

      const nextState = states.fetchedConfirmedMessagesSuccess(state, {
        messages: messagesFromAPI,
        total: 99
      })

      expect(nextState.messages.confirmed.length).toBe(
        messagesFromAPI.length + 1
      )
      expect(nextState.messages.confirmed[10]).toEqual(msg)
    })

    test('it sets the loading states properly', () => {
      const { messages } = states.fetchedConfirmedMessagesSuccess(
        initialState,
        {
          messages: messagesFromAPI,
          total: 99
        }
      )

      expect(messages.loading).toBe(false)
      expect(messages.loadedSuccess).toBe(true)
      expect(messages.loadedFailure).toBe(false)
      expect(messages.paginating).toBe(false)
    })
  })

  describe('fetchedConfirmedMessagesFailure', () => {
    test('it keeps messages that were previously in state, in state', () => {
      const pending = [
        new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: 1
        })
      ]
      const confirmed = [
        new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: 0
        })
      ]

      const state = {
        ...initialState,
        messages: { ...initialState.messages, pending, confirmed }
      }

      const nextState = states.fetchedConfirmedMessagesFailure(state)
      expect(nextState.messages.pending.length).toBe(1)
      expect(nextState.messages.confirmed.length).toBe(1)
    })

    test('it sets the loading states properly', () => {
      const { messages } = states.fetchedConfirmedMessagesFailure(initialState)
      expect(messages.loading).toBe(false)
      expect(messages.loadedSuccess).toBe(false)
      expect(messages.loadedFailure).toBe(true)
      expect(messages.paginating).toBe(false)
    })

    test('it adds the error to state', () => {
      const err = new Error()
      const { error } = states.fetchedConfirmedMessagesFailure(
        initialState,
        err
      )
      expect(error).toBe(err)
    })
  })

  describe('fetchingNextPage', () => {
    test('it properly sets loading states', () => {
      const { messages } = states.fetchingNextPage(initialState)
      expect(messages.paginating).toBe(true)
    })
  })

  describe('error', () => {
    test('it sets the error in state', () => {
      const err = new Error('test')
      const { error } = states.error(initialState, err)
      expect(error).toEqual(err)
    })
  })

  describe('clearError', () => {
    test('it clears the error from state', () => {
      const { error } = states.clearError(initialState)
      expect(error).toBeNull()
    })
  })

  describe('populateRedux', () => {
    test('it sets pending messages in state', () => {
      const pendingMsgs = []
      for (let i = 0; i < 10; i += 1) {
        const message = new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: i
        })
        pendingMsgs.push(message)
      }

      const { messages } = states.populateRedux(initialState, { pendingMsgs })
      expect(messages.pending.length).toBe(pendingMsgs.length)
      expect(messages.pending[0]).toEqual(pendingMsgs[0])
    })
  })

  describe('switchNetwork', () => {
    test('it sets the network in state', () => {
      const { network } = states.switchNetwork(initialState, {
        network: MAINNET,
        wallets: []
      })

      expect(network).toBe(MAINNET)
    })

    test('it sets new wallets in state', () => {
      const wallets = [
        {
          address: 'f1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: ''
        },
        {
          address: 'f1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: ''
        }
      ]
      const nextState = states.switchNetwork(initialState, {
        network: MAINNET,
        wallets
      })

      expect(nextState.wallets).toEqual(wallets)
    })

    test('it resets the messages in state to the initial message state', () => {
      const state = {
        ...initialState,
        messages: { ...initialState.messages, loading: true }
      }

      const nextState = states.switchNetwork(state, {
        network: MAINNET,
        wallets: []
      })
      expect(nextState.messages).toEqual(states.initialMessagesState)
    })
  })
})
