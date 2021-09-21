import '@testing-library/jest-dom/extend-expect'
import { act, renderHook } from '@testing-library/react-hooks'
import { cleanup } from '@testing-library/react'
import { ReactNode } from 'react'

import { MULTISIG_ACTOR_ADDRESS } from './__mocks__'
import { useMsig, MsigProviderWrapper } from '.'
import WalletProviderWrapper from '../WalletProvider'
import mockReduxStoreWithState from '../test-utils/composeMockAppTree/mockReduxStoreWithState'
import { Provider } from 'react-redux'
import { MsigActorState } from './types'
import { EXEC_ACTOR } from '../constants'

jest.mock('../WalletProvider')

describe('Multisig provider', () => {
  describe('Fetching state', () => {
    afterEach(cleanup)
    // @ts-ignore
    let Tree = ({ children }) => <>{children}</>
    beforeEach(() => {
      jest.clearAllMocks()
      jest
        .spyOn(require('../utils/msig/isAddressSigner'), 'default')
        .mockImplementation(async () => true)

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

    test('useMsig hook exposes a method to set multisig address', () => {
      const { result } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      expect(result.current.setMsigActor).not.toBeUndefined()
    })

    test('setting the msig actor sets the state in context', async () => {
      const { result } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      act(() => {
        result.current.setMsigActor(MULTISIG_ACTOR_ADDRESS)
      })
      expect(result.current.Address).toBe(MULTISIG_ACTOR_ADDRESS)
    })

    test('setting the msig actor fetches the state from lotus and populates the context', async () => {
      let { waitForNextUpdate, result } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      act(() => {
        result.current.setMsigActor(MULTISIG_ACTOR_ADDRESS)
      })
      await waitForNextUpdate()

      const msigState: MsigActorState = result.current

      expect(msigState.Address).toBe(MULTISIG_ACTOR_ADDRESS)
      expect(msigState.ActorCode.includes('multisig')).toBeTruthy()
      expect(msigState.AvailableBalance.gt(0)).toBeTruthy()
      expect(msigState.Balance.gt(0)).toBeTruthy()
      expect(msigState.NumApprovalsThreshold).toBeTruthy()
      expect(msigState.Signers.length).toBeGreaterThan(0)
    })
  })

  describe('Error handling', () => {
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

    test.skip('if wallet address is not a signer, the address not a signer error populates', async () => {
      // NO MATTER WTF I DO THIS OVERRIDDEN MOCK NEVER GETS PICKED UP. ALWAYS STILL RETURNS TRUE. GONNA MURDER SOMEONE
      jest
        .spyOn(require('../utils/msig/isAddressSigner'), 'default')
        .mockImplementation(async () => false)

      let { waitForNextUpdate, result } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      act(() => {
        result.current.setMsigActor(MULTISIG_ACTOR_ADDRESS)
      })
      await waitForNextUpdate()

      const msigState: MsigActorState = result.current

      expect(msigState.errors.connectedWalletNotMsigSigner).toBeTruthy()
    })

    test('if address is not a multisig actor address, the not multisig actor error should get thrown', async () => {
      let { waitForNextUpdate, result } = renderHook(() => useMsig(), {
        wrapper: Tree
      })
      act(() => {
        result.current.setMsigActor(EXEC_ACTOR)
      })
      await waitForNextUpdate()

      const msigState: MsigActorState = result.current
      expect(msigState.errors.notMsigActor).toBeTruthy()
    })

    test('if address is not an actor, the not actor error should get thrown', async () => {
      let { waitForNextUpdate, result } = renderHook(() => useMsig(), {
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
    })
  })
})
