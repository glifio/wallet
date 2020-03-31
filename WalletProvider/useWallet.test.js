import { renderHook } from '@testing-library/react-hooks'
import { cleanup } from '@testing-library/react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { Provider } from 'react-redux'
import WalletProviderWrapper, { useWalletProvider } from '.'
import useWallet from './useWallet'
import { initializeStore } from '../test-utils'
import { LEDGER } from '../constants'

describe('useWallet', () => {
  afterEach(cleanup)
  test('it returns a nullWallet state when no wallet exists in redux', () => {
    const store = initializeStore()
    const wrapper = ({ children }) => (
      <Provider store={store}>
        <WalletProviderWrapper network='t'>{children}</WalletProviderWrapper>
      </Provider>
    )
    const { result } = renderHook(() => useWallet(), { wrapper })
    expect(result.current.address).toBeFalsy()
    expect(result.current.path).toBeFalsy()
    expect(result.current.type).toBeFalsy()
    expect(result.current.index).toBe(-1)
    expect(result.current.balance.toString()).toBe('0')
  })

  test('it returns a wallet when one is selected in redux', async () => {
    const initialState = {
      wallets: [
        { address: 't123', balance: new FilecoinNumber('1', 'fil'), path: '' }
      ],
      selectedWalletIdx: 0
    }
    const store = initializeStore(initialState)

    const wrapper = ({ children }) => (
      <Provider store={store}>
        <WalletProviderWrapper network='t'>{children}</WalletProviderWrapper>
      </Provider>
    )

    const {
      result: { current }
    } = renderHook(
      () => {
        const { state } = useWalletProvider()
        state.walletType = LEDGER
        return useWallet()
      },
      { wrapper }
    )

    expect(current.address).toBe(initialState.wallets[0].address)
    expect(current.path).toBe(initialState.wallets[0].path)
    expect(current.type).toBe(LEDGER)
    expect(current.index).toBe(initialState.selectedWalletIdx)
    expect(current.balance.toString()).toBe(
      initialState.wallets[0].balance.toString()
    )
  })
})
