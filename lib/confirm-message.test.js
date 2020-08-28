import React from 'react'
import MsgConfirmer from './confirm-message'
import { cleanup, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Message } from '@openworklabs/filecoin-message'
import clonedeep from 'lodash.clonedeep'

import { WalletProviderContext } from '../WalletProvider'
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

const renderMessageConfirmationService = (state, walletProvider) => {
  const defaultWalletProvider = {
    jsonRpcEngine: {
      request: () =>
        Promise.resolve({
          Receipt: {
            ExitCode: 0
          }
        })
    }
  }

  const store = initializeStore(state ? state : initialStateForTests)

  return {
    ...render(
      <Provider store={store}>
        {
          <WalletProviderContext.Provider
            value={{
              state: { walletProvider: walletProvider || defaultWalletProvider }
            }}
          >
            <MsgConfirmer />
          </WalletProviderContext.Provider>
        }
      </Provider>
    ),
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

  test('it dispatches the confirmedMessage action when a valid Receipt comes through', async () => {
    renderMessageConfirmationService()
    jest.runOnlyPendingTimers()
    await flushPromises()
    const res = mockDispatch.mock.results[0].value[0]
    expect(mockDispatch).toHaveBeenCalled()
    expect(res.type).toBe(CONFIRMED_MESSAGE)
    expect(res.payload.msgCid).toBe(messageCid)
  })

  test('it confirms despite the server timing out', async () => {
    const requestMock = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('504')
      })
      .mockImplementationOnce(() => {
        throw new Error('504')
      })
      .mockImplementationOnce(() =>
        Promise.resolve({
          Receipt: {
            ExitCode: 0
          }
        })
      )

    const walletProvider = {
      jsonRpcEngine: {
        request: requestMock
      }
    }

    renderMessageConfirmationService(null, walletProvider)
    jest.runAllTimers()
    await flushPromises()
    expect(mockDispatch).toHaveBeenCalled()
    expect(requestMock).toHaveBeenCalledTimes(3)
  })

  test('it confirms despite the server returning actor resolution error', async () => {
    const requestMock = jest
      .fn()
      .mockImplementationOnce(() => {
        return Promise.resolve(null)
      })
      .mockImplementationOnce(() => {
        return Promise.resolve(null)
      })
      .mockImplementationOnce(() =>
        Promise.resolve({
          Receipt: {
            ExitCode: 0
          }
        })
      )

    const walletProvider = {
      jsonRpcEngine: {
        request: requestMock
      }
    }

    renderMessageConfirmationService(null, walletProvider)
    // we wait for each request to get made
    // im not sure why this wont work in the same way as the test above ^^
    jest.runAllTimers()
    await flushPromises()
    jest.runOnlyPendingTimers()
    await flushPromises()
    jest.runOnlyPendingTimers()
    await flushPromises()
    expect(mockDispatch).toHaveBeenCalled()
    expect(requestMock).toHaveBeenCalledTimes(3)
  })

  test('it only listens when pending messages exist', async () => {
    const requestMock = jest.fn()
    const walletProvider = {
      jsonRpcEngine: {
        request: requestMock
      }
    }
    renderMessageConfirmationService(initialState, walletProvider)
    jest.runAllTimers()
    await flushPromises()
    expect(requestMock).not.toHaveBeenCalled()
  })

  test('it confirms multiple messages at once', async () => {
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
    const state = clonedeep(initialState)
    state.messages.pending = [message, message2]
    const requestMock = jest.fn(() =>
      Promise.resolve({
        Receipt: {
          ExitCode: 0
        }
      })
    )
    const walletProvider = {
      jsonRpcEngine: {
        request: requestMock
      }
    }
    renderMessageConfirmationService(state, walletProvider)
    jest.runAllTimers()
    await flushPromises()
    expect(requestMock).toHaveBeenCalledTimes(2)
  })

  /** This test needs work and will change anyways once  https://github.com/openworklabs/filecoin-web-wallet/issues/88 lands */
  // test('it avoids extra calls when an additional pending message is added', async () => {
  //   const message = new Message({
  //     from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
  //     to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
  //     value: '1000',
  //     method: 0,
  //     nonce: 0
  //   }).toLotusType()
  //   message.cid = '123'
  //   const message2 = new Message({
  //     from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
  //     to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
  //     value: '1000',
  //     method: 0,
  //     nonce: 1
  //   }).toLotusType()
  //   message2.cid = '456'
  //   const state = clonedeep(initialState)
  //   state.messages.pending = [message]

  //   let count = 0
  //   const requestMock = jest.fn(
  //     () =>
  //       new Promise((resolve, reject) => {
  //         setImmediate(() => {
  //           if (count === 0) {
  //             count++
  //             reject(new Error('504'))
  //           } else {
  //             return resolve({
  //               Receipt: {
  //                 ExitCode: 0
  //               }
  //             })
  //           }
  //         })
  //       })
  //   )

  //   const walletProvider = {
  //     jsonRpcEngine: {
  //       request: requestMock
  //     }
  //   }
  //   const { store } = renderMessageConfirmationService(state, walletProvider)
  //   act(() => {
  //      store.dispatch(confirmMessage(toLowerCaseMsgFields(message2)))
  //   });
  //   store.dispatch(confirmMessage(toLowerCaseMsgFields(message2)))
  //   await flushPromises()

  //   // we should still only see two requests made
  //   // expect(requestMock).toHaveBeenCalledTimes(3)
  //   expect(mockDispatch).toHaveBeenCalledTimes(2)
  // })
})
