import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { cleanup, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { SINGLE_KEY } from '../constants'
import { WalletProviderContext } from '../WalletProvider'
import { flushPromises, initializeStore } from '../test-utils'
import { initialState } from '../store/states'
import clonedeep from 'lodash.clonedeep'

import useUpToDateBalance from './update-balance'
import { UPDATE_BALANCE } from '../store/actionTypes'
import { switchWallet } from '../store/actions'

const defaultBalance = new FilecoinNumber('1', 'fil')
const changedBalance = new FilecoinNumber('.9', 'fil')

const wallets = [
  {
    address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
    balance: defaultBalance,
    path: SINGLE_KEY
  }
]

const initialStateForTests = clonedeep({
  ...initialState,
  selectedWalletIdx: 0,
  wallets
})

const renderBalancePoller = (state, walletProvider) => {
  const defaultWalletProvider = {
    getBalance: async () => Promise.resolve(changedBalance)
  }

  const store = initializeStore(state ? state : initialStateForTests)

  const BalancePoller = () => {
    useUpToDateBalance()
    return null
  }

  return {
    ...render(
      <Provider store={store}>
        {
          <WalletProviderContext.Provider
            value={{
              state: {
                walletProvider: walletProvider || defaultWalletProvider
              }
            }}
          >
            <BalancePoller />
          </WalletProviderContext.Provider>
        }
      </Provider>
    ),
    store
  }
}

describe('update-balance', () => {
  let mockDispatch
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    mockDispatch = jest.fn((...args) => args)
    jest
      .spyOn(require('react-redux'), 'useDispatch')
      .mockImplementation(() => mockDispatch)
  })
  afterEach(() => {
    jest.clearAllTimers()
    cleanup()
  })

  test('it dispatches the updateBalance action when the accounts balance changes', async () => {
    renderBalancePoller()
    jest.runOnlyPendingTimers()
    await flushPromises()
    expect(mockDispatch).toHaveBeenCalled()
    const res = mockDispatch.mock.results[0].value[0]
    expect(res.type).toBe(UPDATE_BALANCE)
    expect(res.payload.balance.toString()).toEqual(changedBalance.toString())
    expect(res.payload.walletIdx).toEqual(0)
  })

  test('it updates the right wallet balance when multiple wallets are loaded', async () => {
    const wallets = [
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: SINGLE_KEY
      },
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: SINGLE_KEY
      }
    ]
    const newState = clonedeep({
      ...initialState,
      selectedWalletIdx: 1,
      wallets
    })

    renderBalancePoller(newState)

    jest.runOnlyPendingTimers()
    await flushPromises()
    expect(mockDispatch).toHaveBeenCalled()
    const res = mockDispatch.mock.results[0].value[0]
    expect(res.type).toBe(UPDATE_BALANCE)
    expect(res.payload.balance.toString()).toEqual(changedBalance.toString())
    expect(res.payload.walletIdx).toEqual(1)
  })

  test('it recursively polls to get the right balance', async () => {
    const getBalanceMock = jest
      .fn(() => Promise.resolve(defaultBalance))
      .mockImplementationOnce(() => Promise.resolve(defaultBalance))
      .mockImplementationOnce(() => Promise.resolve(defaultBalance))
      .mockImplementationOnce(() => Promise.resolve(changedBalance))

    const walletProvider = {
      getBalance: getBalanceMock
    }
    renderBalancePoller(null, walletProvider)
    // fast forward first call - unchanged balance
    jest.runOnlyPendingTimers()
    await flushPromises()
    expect(mockDispatch).not.toHaveBeenCalled()

    // fast forward second call - unchanged balance
    jest.runOnlyPendingTimers()
    await flushPromises()
    expect(mockDispatch).not.toHaveBeenCalled()

    // fast forward third call - changed balance
    jest.runOnlyPendingTimers()
    await flushPromises()
    expect(mockDispatch).toHaveBeenCalled()
    const res = mockDispatch.mock.results[0].value[0]
    expect(res.type).toBe(UPDATE_BALANCE)
    expect(res.payload.balance.toString()).toEqual(changedBalance.toString())
    expect(res.payload.walletIdx).toEqual(0)
  })

  test('it does not poll for balances when no wallets exist in state', async () => {
    const wallets = []
    const newState = clonedeep({
      ...initialState,
      selectedWalletIdx: -1,
      wallets
    })

    const getBalanceMock = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(defaultBalance))

    const walletProvider = {
      getBalance: getBalanceMock
    }

    renderBalancePoller(newState, walletProvider)
    jest.runOnlyPendingTimers()
    await flushPromises()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(getBalanceMock).not.toHaveBeenCalled()
  })

  test('it polls for the current wallet in redux', async () => {
    const wallets = [
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: defaultBalance,
        path: SINGLE_KEY
      },
      {
        address: 't2jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: changedBalance,
        path: SINGLE_KEY
      }
    ]
    const newState = clonedeep({
      ...initialState,
      selectedWalletIdx: 0,
      wallets
    })

    const getBalanceMock = jest.fn(() => Promise.resolve(defaultBalance))

    const walletProvider = {
      getBalance: getBalanceMock
    }

    const { store } = renderBalancePoller(newState, walletProvider)

    // let the calls go through to start the polling
    jest.runOnlyPendingTimers()
    await flushPromises()

    expect(getBalanceMock).toHaveBeenCalledWith(wallets[0].address)
    expect(mockDispatch).not.toHaveBeenCalled()

    jest.clearAllMocks()

    store.dispatch(switchWallet(1))
    jest.runAllTimers()
    await flushPromises()

    expect(getBalanceMock).not.toHaveBeenCalledWith(wallets[0].address)
    expect(getBalanceMock).toHaveBeenCalledWith(wallets[1].address)

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    const res = mockDispatch.mock.results[0].value[0]
    expect(res.type).toBe(UPDATE_BALANCE)
    expect(res.payload.balance.toString()).toEqual(defaultBalance.toString())
    expect(res.payload.walletIdx).toEqual(1)
  })
})
