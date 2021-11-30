import { FilecoinNumber } from '@glif/filecoin-number'
import LotusRPCEngine from '@glif/filecoin-rpc-client'
import { cleanup } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

import { useBalancePoller } from './update-balance'
import WalletProviderWrapper from '../WalletProvider'
import { composeWalletProviderState } from '../test-utils/composeMockAppTree/composeState'
import { initialState as _walletProviderInitialState } from '../WalletProvider/state'
import { SWRConfig } from 'swr'

jest.mock('@glif/filecoin-rpc-client')
jest.mock('../WalletProvider')

describe('useBalancePoller', () => {
  afterEach(cleanup)

  let Tree = ({ children }) => <>{children}</>
  let walletProviderState
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it updates the wallets balance in the walletprovider state when the balance changes', async () => {
    const statePreset = 'postOnboard'
    const walletProviderInitialState = composeWalletProviderState(
      _walletProviderInitialState,
      statePreset
    )

    walletProviderState = { ...walletProviderInitialState }

    const cacheWalletProviderState = (state) => {
      walletProviderState = { ...state }
      return <></>
    }

    Tree = ({ children }) => (
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <WalletProviderWrapper
          getState={cacheWalletProviderState}
          statePreset={statePreset}
          initialState={walletProviderInitialState}
        >
          {children}
        </WalletProviderWrapper>
      </SWRConfig>
    )

    const bigBal = new FilecoinNumber('100', 'fil')
    LotusRPCEngine.mockImplementation(() => {
      return {
        request: jest.fn(async () => bigBal.toAttoFil())
      }
    })

    const beforeUpdateWalletBal = walletProviderState.wallets[0].balance.toFil()

    const { unmount, waitForNextUpdate } = renderHook(
      () => useBalancePoller(),
      {
        wrapper: Tree
      }
    )

    await waitForNextUpdate()

    const afterUpdateWalletBal = walletProviderState.wallets[0].balance.toFil()
    unmount()
    expect(beforeUpdateWalletBal).not.toBe(afterUpdateWalletBal)
    expect(bigBal.toFil()).toBe(afterUpdateWalletBal)
  })

  test('it updates the right wallet balance in state', async () => {
    const statePreset = 'selectedOtherWallet'
    const walletProviderInitialState = composeWalletProviderState(
      _walletProviderInitialState,
      statePreset
    )

    walletProviderState = { ...walletProviderInitialState }

    const cacheWalletProviderState = (state) => {
      walletProviderState = { ...state }
      return <></>
    }

    Tree = ({ children }) => (
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <WalletProviderWrapper
          getState={cacheWalletProviderState}
          statePreset={statePreset}
          initialState={walletProviderInitialState}
        >
          {children}
        </WalletProviderWrapper>
      </SWRConfig>
    )

    const bigBal = new FilecoinNumber('100', 'fil')
    LotusRPCEngine.mockImplementation(() => {
      return {
        request: jest.fn(async () => bigBal.toAttoFil())
      }
    })

    const beforeUpdateDefaultWalletBal =
      walletProviderState.wallets[0].balance.toFil()
    const beforeUpdateSecondaryWalletBal =
      walletProviderState.wallets[1].balance.toFil()

    const { unmount, waitForNextUpdate } = renderHook(
      () => useBalancePoller(),
      {
        wrapper: Tree
      }
    )

    await waitForNextUpdate()

    const afterUpdateDefaultWalletBal =
      walletProviderState.wallets[0].balance.toFil()
    const afterUpdateSecondaryWalletBal =
      walletProviderState.wallets[1].balance.toFil()
    unmount()
    expect(beforeUpdateSecondaryWalletBal).not.toBe(
      afterUpdateSecondaryWalletBal
    )
    expect(bigBal.toFil()).toBe(afterUpdateSecondaryWalletBal)
    expect(beforeUpdateDefaultWalletBal).toBe(afterUpdateDefaultWalletBal)
  })
})
