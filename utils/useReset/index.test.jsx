import { renderHook, act } from '@testing-library/react-hooks'
import useReset from '.'
import WalletProviderWrapper, {
  initialState as _walletProviderInitialState
} from '@glif/react-components'

import { composeWalletProviderState } from '../../test-utils/composeMockAppTree/composeState'

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

    const Tree = ({ children }) => (
      <WalletProviderWrapper
        getState={cacheWalletProviderState}
        statePreset={statePreset}
        initialState={walletProviderInitialState}
      >
        {children}
      </WalletProviderWrapper>
    )

    const {
      result: { current }
    } = renderHook(() => useReset(), { wrapper: Tree })

    act(() => {
      // this is the reset hook
      current()
    })

    expect(JSON.stringify(walletProviderState)).toBe(
      JSON.stringify(_walletProviderInitialState)
    )
  })
})
