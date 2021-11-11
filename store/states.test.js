import { Message } from '@glif/filecoin-message'
import * as states from './states'

describe('state manipulators', () => {
  // implicitly tests state mutations
  const initialState = Object.freeze(states.initialState)

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

  describe('clearMessages', () => {
    test('it clears messages from state', () => {
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
        messages: {
          ...initialState.messages,
          confirmed: [message],
          pending: [secondMsg],
          total: 1
        }
      }

      expect(JSON.stringify(states.clearMessages(state))).toEqual(
        JSON.stringify(initialState)
      )
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
        messages: { ...initialState.messages, pending },
        wallets: [
          {
            balance: '0',
            address: 'f1',
            path: ''
          }
        ],
        selectedWalletIdx: 0
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
        wallets: [
          {
            balance: '0',
            address: 'f1',
            path: ''
          }
        ],
        selectedWalletIdx: 0,
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
        {
          ...initialState,
          wallets: [
            {
              balance: '0',
              address: 'f1',
              path: ''
            }
          ],
          selectedWalletIdx: 0
        },
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
        }).toSerializeableType()
        message.cid = `QmZ${i}`
        pendingMsgs.push(message)
      }

      const { messages } = states.populateRedux(initialState, { pendingMsgs })
      expect(messages.pending.length).toBe(pendingMsgs.length)
      expect(messages.pending[0]).toEqual(pendingMsgs[0])
    })
  })
})
