import { renderHook, act } from '@testing-library/react-hooks'
import { Provider } from 'react-redux'
import useReset from '.'
import { initializeStore } from '../../test-utils'
import { WalletProviderContext } from '../../WalletProvider'
import { initialState } from '../../store/states'

describe('useReset', () => {
  test('it resets both the redux and walletprovider state when called', () => {
    const resetState = jest.fn()
    const screwedUpState = { wallets: [], selectedWalletIdx: -10000 }
    const store = initializeStore(screwedUpState)
    const wrapper = ({ children }) => (
      <Provider store={store}>
        <WalletProviderContext.Provider value={{ state: {}, resetState }}>
          {children}
        </WalletProviderContext.Provider>
      </Provider>
    )

    const {
      result: { current }
    } = renderHook(() => useReset(), { wrapper })

    act(() => {
      // this is the reset hook
      current()
    })
    expect(JSON.stringify(store.getState())).toEqual(
      JSON.stringify(initialState)
    )
    expect(resetState).toHaveBeenCalled()
  })
})
