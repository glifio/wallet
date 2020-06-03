import { renderHook } from '@testing-library/react-hooks'
import { cleanup } from '@testing-library/react'
import useWallet from './useWallet'
import { IMPORT_MNEMONIC } from '../constants'
import composeMockAppTree from '../test-utils/composeMockAppTree'

describe('useWallet', () => {
  afterEach(cleanup)
  test('it returns a nullWallet state when no wallet exists in redux', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { result } = renderHook(useWallet, { wrapper: Tree })
    expect(result.current.address).toBeFalsy()
    expect(result.current.path).toBeFalsy()
    expect(result.current.type).toBeFalsy()
    expect(result.current.index).toBe(-1)
    expect(result.current.balance.toString()).toBe('0')
  })

  test('it returns a wallet when one is selected in redux', async () => {
    const { Tree, store } = composeMockAppTree('postOnboard')
    const {
      result: { current }
    } = renderHook(useWallet, { wrapper: Tree })

    expect(current.address).toBe(store.getState().wallets[0].address)
    expect(current.path).toBe(store.getState().wallets[0].path)
    expect(current.type).toBe(IMPORT_MNEMONIC)
    expect(current.index).toBe(store.getState().selectedWalletIdx)
    expect(current.balance.toString()).toBe(
      store.getState().wallets[0].balance.toString()
    )
  })
})
