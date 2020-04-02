import { act, cleanup, render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { Provider } from 'react-redux'
import WalletProvider from '@openworklabs/filecoin-wallet-provider'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import WalletProviderContextWrapper, { useWalletProvider } from '../'
import { initializeStore } from '../../test-utils'
import { initialState } from '../../store/states'
import HDWalletProvider from './HDWalletProvider'

jest.mock('@zondax/filecoin-signer-wasm')

jest.mock('@openworklabs/filecoin-wallet-provider')
const mockGetAccounts = jest
  .fn()
  .mockImplementation(() =>
    Promise.resolve(['t1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq'])
  )

const mockGetBalance = jest
  .fn()
  .mockImplementation(() => Promise.resolve(new FilecoinNumber('1', 'fil')))

WalletProvider.mockImplementation(() => {
  return {
    wallet: {
      getAccounts: mockGetAccounts
    },
    getBalance: mockGetBalance
  }
})

const createComponent = (state, ready = true) => {
  const store = initializeStore(state ? state : Object.freeze(initialState))
  const Component = ({ children }) => (
    <Provider store={store}>
      <WalletProviderContextWrapper network='t'>
        <HDWalletProvider
          ready={ready}
          mnemonic='cave income cousin wood glare have forest alcohol social thing fame tissue essay surface coral flock brick destroy remind depart hover rose skin alarm'
        />
        {children}
      </WalletProviderContextWrapper>
    </Provider>
  )
  return {
    Component,
    store
  }
}

describe('HDWallet', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  /** should add tests for the actual wallet sub provider methods getAccount and sign, but need this https://github.com/testing-library/react-hooks-testing-library/issues/331 */
  test('it adds the provider to the walletprovider context', async () => {
    const { Component } = createComponent()
    const { result, waitForNextUpdate } = renderHook(
      () => useWalletProvider(),
      {
        wrapper: Component
      }
    )

    await waitForNextUpdate()

    expect(result.current.walletProvider).not.toBeNull()
  })

  test('it does not render anything', async () => {
    const { Component } = createComponent()

    await act(async () => {
      const { container } = render(<Component />)
      expect(container.firstChild).toBeNull()
    })
  })

  test('it adds the default wallet to Redux', async () => {
    const { store, Component } = createComponent()

    let res
    await act(async () => {
      res = render(<Component />)
    })

    const state = store.getState()
    expect(state.wallets).toHaveLength(1)
    expect(state.wallets[0].address).toBe(
      't1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq'
    )
    expect(state.wallets[0].balance.toString()).toBe('1')
  })
})
