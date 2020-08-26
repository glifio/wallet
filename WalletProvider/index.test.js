import { renderHook } from '@testing-library/react-hooks'
import { cleanup } from '@testing-library/react'

import WalletProviderWrapper, { useWalletProvider } from '.'
import { initialState } from './state'
import { TESTNET } from '../constants'

const spy = jest.spyOn(require('../lib/WasmLoader'), 'useWasm')

const createMockSubprovider = () => {
  return {
    sign: jest.fn(),
    getAccounts: jest.fn()
  }
}

const walletSubproviders = {
  HDWalletProvider: createMockSubprovider(),
  SingleKeyProvider: createMockSubprovider(),
  LedgerProvider: createMockSubprovider()
}

spy.mockReturnValue({ walletSubproviders })

describe('useWalletProvider', () => {
  afterEach(cleanup)

  test('it exposes the necessary methods to manipulate state', () => {
    const wrapper = ({ children }) => (
      <WalletProviderWrapper network={TESTNET}>
        {children}
      </WalletProviderWrapper>
    )
    const { result } = renderHook(useWalletProvider, { wrapper })
    expect(typeof result.current.dispatch).toBe('function')
    expect(typeof result.current.fetchDefaultWallet).toBe('function')
    expect(typeof result.current.setWalletError).toBe('function')
    expect(typeof result.current.setWalletType).toBe('function')
    expect(typeof result.current.setLedgerProvider).toBe('function')
    expect(typeof result.current.connectLedger).toBe('function')
    expect(typeof result.current.resetLedgerState).toBe('function')
    expect(typeof result.current.resetState).toBe('function')
  })

  test('it passes down the wallet provider state', () => {
    const wrapper = ({ children }) => (
      <WalletProviderWrapper network={TESTNET}>
        {children}
      </WalletProviderWrapper>
    )
    const { result } = renderHook(() => useWalletProvider(), { wrapper })
    expect(JSON.stringify(result.current.state)).toEqual(
      JSON.stringify(initialState)
    )
  })
})
