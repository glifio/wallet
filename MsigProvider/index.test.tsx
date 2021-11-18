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
import { EXEC_ACTOR } from '../constants'
import { composeWalletProviderState } from '../test-utils/composeMockAppTree/composeState'
import { initialState as _walletProviderInitialState } from '../WalletProvider/state'

jest.mock('../WalletProvider')

describe('Multisig provider', () => {
  describe('Fetching state', () => {
    afterEach(cleanup)
    let Tree = ({ children }) => <>{children}</>
    beforeEach(() => {
      jest.clearAllMocks()

      const statePreset = 'postOnboard'
      const mockReduxStore = mockReduxStoreWithState({ statePreset })
      const walletProviderInitialState = composeWalletProviderState(
        _walletProviderInitialState,
        statePreset
      )
      Tree = ({ children }: { children: ReactNode }) => (
        <Provider store={mockReduxStore}>
          <WalletProviderWrapper
            // @ts-expect-error
            getState={() => {}}
            statePreset={statePreset}
            initialState={walletProviderInitialState}
          >
            <MsigProviderWrapper test>{children}</MsigProviderWrapper>
          </WalletProviderWrapper>
        </Provider>
      )
    })

    test('useMsig hook exposes a method to set multisig address', () => {
      const { result, unmount } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      expect(result.current.setMsigActor).not.toBeUndefined()
      unmount()
    })

    test('setting the msig actor sets the state in context', async () => {
      const { result, unmount } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      act(() => {
        result.current.setMsigActor(MULTISIG_ACTOR_ADDRESS)
      })
      expect(result.current.Address).toBe(MULTISIG_ACTOR_ADDRESS)
      unmount()
    })

    test('setting the msig actor fetches the state from lotus and populates the context', async () => {
      jest
        .spyOn(require('../utils/msig/isAddressSigner'), 'default')
        .mockImplementation(async () => true)
      let { waitForNextUpdate, result, unmount } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      act(() => {
        result.current.setMsigActor(MULTISIG_ACTOR_ADDRESS)
      })
      await waitForNextUpdate({ timeout: false })

      const msigState: MsigActorState = result.current

      expect(msigState.Address).toBe(MULTISIG_ACTOR_ADDRESS)
      expect(msigState.ActorCode.includes('multisig')).toBeTruthy()
      expect(msigState.AvailableBalance.gt(0)).toBeTruthy()
      expect(msigState.Balance.gt(0)).toBeTruthy()
      expect(msigState.NumApprovalsThreshold).toBeTruthy()
      expect(msigState.Signers.length).toBeGreaterThan(0)
      unmount()
    }, 10000)
  })

  describe('Error handling', () => {
    afterEach(cleanup)
    // @ts-ignore
    let Tree = ({ children }) => <>{children}</>
    beforeEach(() => {
      jest.clearAllMocks()

      const statePreset = 'postOnboard'
      const mockReduxStore = mockReduxStoreWithState({ statePreset })
      const walletProviderInitialState = composeWalletProviderState(
        _walletProviderInitialState,
        statePreset
      )
      Tree = ({ children }: { children: ReactNode }) => (
        <Provider store={mockReduxStore}>
          <WalletProviderWrapper
            // @ts-expect-error
            getState={() => {}}
            statePreset={statePreset}
            initialState={walletProviderInitialState}
          >
            <MsigProviderWrapper test>{children}</MsigProviderWrapper>
          </WalletProviderWrapper>
        </Provider>
      )
    })

    test('if address is not a multisig actor address, the not multisig actor error should get thrown', async () => {
      let { waitForNextUpdate, result, unmount } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      act(() => {
        result.current.setMsigActor(EXEC_ACTOR)
      })
      await waitForNextUpdate()

      const msigState: MsigActorState = result.current
      expect(msigState.errors.notMsigActor).toBeTruthy()
      unmount()
    })

    test('if address is not an actor, the not actor error should get thrown', async () => {
      let { waitForNextUpdate, result, unmount } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      act(() => {
        result.current.setMsigActor(
          'f3vob5jvvypwlb2sqz6oeztzbsf5c4hjtqxs2xb2mhaneyiu3wmyd4fkigmiv2rgsm4aztmgvxwuybiwusoxea'
        )
      })
      await waitForNextUpdate()

      const msigState: MsigActorState = result.current

      expect(msigState.errors.actorNotFound).toBeTruthy()
      unmount()
    })
  })
})
