import { renderHook, act } from '@testing-library/react-hooks'
import { Provider } from 'react-redux'
import useReset from '.'
import { initializeStore } from '../../test-utils'
import WalletProviderWrapper from '../../WalletProvider'
import { initialState as _walletProviderInitialState } from '../../WalletProvider/state'

import { initialState } from '../../store/states'
import { composeWalletProviderState } from '../../test-utils/composeMockAppTree/composeState'

jest.mock('../../WalletProvider')

describe('useReset', () => {
  test('it resets both the redux and walletprovider state when called', () => {
    const statePreset = 'postOnboard'
    const walletProviderInitialState = composeWalletProviderState(
      _walletProviderInitialState,
      statePreset
    )

    let walletProviderState = { ...walletProviderInitialState }

    const cacheWalletProviderState = (state) => {
      walletProviderState = { ...state }
      return <></>
    }

    const screwedUpState = { wallets: [], selectedWalletIdx: -10000 }
    const store = initializeStore(screwedUpState)

    const Tree = ({ children }) => (
      <Provider store={store}>
        <WalletProviderWrapper
          getState={cacheWalletProviderState}
          statePreset={statePreset}
          initialState={walletProviderInitialState}
        >
          {children}
        </WalletProviderWrapper>
      </Provider>
    )

    const {
      result: { current }
    } = renderHook(() => useReset(), { wrapper: Tree })

    act(() => {
      // this is the reset hook
      current()
    })
    expect(JSON.stringify(store.getState())).toEqual(
      JSON.stringify({ ...initialState })
    )

    expect(JSON.stringify(walletProviderState)).toBe(
      JSON.stringify(_walletProviderInitialState)
    )
  })
})
