import '@testing-library/jest-dom/extend-expect'
import { act, renderHook } from '@testing-library/react-hooks'
import { cleanup } from '@testing-library/react'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { MULTISIG_ACTOR_ADDRESS } from '../test-utils/constants'
import { useMsig, MsigProviderWrapper } from '.'
import WalletProviderWrapper from '../WalletProvider'
import mockReduxStoreWithState from '../test-utils/composeMockAppTree/mockReduxStoreWithState'
import { MsigActorState } from './types'

jest.mock('../WalletProvider')

// trying to mock a module with two differet functions and the react hooks test renderer does not work
// so this file tests 1 function that depends on a different implementation of a mock

describe('Not a signer error handling', () => {
  afterEach(cleanup)
  // @ts-ignore
  let Tree = ({ children }) => <>{children}</>
  beforeEach(() => {
    jest.clearAllMocks()
    const statePreset = 'postOnboard'
    const mockReduxStore = mockReduxStoreWithState({ statePreset })
    Tree = ({ children }: { children: ReactNode }) => (
      <Provider store={mockReduxStore}>
        {/* @ts-ignore */}
        <WalletProviderWrapper statePreset={statePreset}>
          <MsigProviderWrapper test>{children}</MsigProviderWrapper>
        </WalletProviderWrapper>
      </Provider>
    )
  })

  test('if wallet address is not a signer, the address not a signer error populates', async () => {
    jest
      .spyOn(require('../utils/msig/isAddressSigner'), 'default')
      .mockImplementation(async () => false)

    let { waitForNextUpdate, result, unmount } = renderHook(() => useMsig(), {
      wrapper: Tree
    })
    act(() => {
      result.current.setMsigActor(MULTISIG_ACTOR_ADDRESS)
    })
    await waitForNextUpdate({ timeout: false })

    const msigState: MsigActorState = result.current

    expect(msigState.errors.connectedWalletNotMsigSigner).toBeTruthy()
    unmount()
  }, 10000)
})
