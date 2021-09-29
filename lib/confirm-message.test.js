jest.mock('@glif/filecoin-message-confirmer')

import React from 'react'
import confirmMessage from '@glif/filecoin-message-confirmer'
import MsgConfirmer from './confirm-message'
import { cleanup, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Message } from '@glif/filecoin-message'
import clonedeep from 'lodash.clonedeep'

import { flushPromises, initializeStore } from '../test-utils'
import { CONFIRMED_MESSAGE } from '../store/actionTypes'
import { initialState } from '../store/states'

const initialStateForTests = clonedeep(initialState)

const messageCid = 'Qm123'
const message = new Message({
  from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
  to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
  value: '1000',
  method: 0,
  nonce: 0
}).toLotusType()
message.cid = messageCid
initialStateForTests.messages.pending = [message]

initialStateForTests.wallets = [
  {
    address: 'f1',
    balance: '0',
    path: ''
  }
]
initialStateForTests.selectedWalletIdx = 0

const renderMessageConfirmationService = (state) => {
  const store = initializeStore(state ? state : initialStateForTests)

  return {
    ...render(<Provider store={store}>{<MsgConfirmer />}</Provider>),
    store
  }
}

describe('message confirmer', () => {
  let mockDispatch
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockDispatch = jest.fn((...args) => args)
    jest
      .spyOn(require('react-redux'), 'useDispatch')
      .mockImplementation(() => mockDispatch)
  })

  afterEach(cleanup)

  test('it renders nothing', () => {
    const { container } = renderMessageConfirmationService()
    expect(container.firstChild).toBeNull()
  })

  test('it dispatches the confirmedMessage action when the message is confirmed', async () => {
    confirmMessage.mockImplementation(() => Promise.resolve(true))
    renderMessageConfirmationService()

    jest.runOnlyPendingTimers()
    await flushPromises()
    const res = mockDispatch.mock.results[1].value[0]
    expect(mockDispatch).toHaveBeenCalled()
    expect(res.type).toBe(CONFIRMED_MESSAGE)
    expect(res.payload.msgCid).toBe(messageCid)
  })

  test('it only listens when pending messages exist', async () => {
    const requestMock = jest.fn()
    renderMessageConfirmationService({
      ...initialState,
      wallets: [
        {
          address: 'f1',
          balance: '0',
          path: ''
        }
      ],
      selectedWalletIdx: 0
    })
    jest.runAllTimers()
    await flushPromises()
    expect(requestMock).not.toHaveBeenCalled()
  })

  test('it confirms multiple messages at once', async () => {
    confirmMessage.mockImplementation(() => Promise.resolve(true))
    const message = new Message({
      from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
      to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
      value: '1000',
      method: 0,
      nonce: 0
    }).toLotusType()
    message.cid = '123'
    const message2 = new Message({
      from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
      to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
      value: '1000',
      method: 0,
      nonce: 1
    }).toLotusType()
    message2.cid = '456'
    const state = clonedeep({
      ...initialState,
      wallets: [
        {
          address: 'f1',
          balance: '0',
          path: ''
        }
      ],
      selectedWalletIdx: 0
    })
    state.messages.pending = [message, message2]
    const { store } = renderMessageConfirmationService(state)
    jest.runAllTimers()
    await flushPromises()
    expect(store.getState().messages.pending.length).toBe(2)
  })
})
