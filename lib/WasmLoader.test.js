import { cleanup, act, renderHook } from '@testing-library/react-hooks'
import { WasmLoader, useWasm } from './WasmLoader'

jest.mock('@zondax/filecoin-signing-tools')

describe('useWasm', () => {
  afterEach(cleanup)

  test('it returns the wallet subproviders', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(useWasm, {
        wrapper: WasmLoader
      })
      await waitForNextUpdate()
      expect(!!result.current.walletSubproviders).toBe(true)
      expect(!!result.current.walletSubproviders.HDWalletProvider).toBe(true)
      expect(!!result.current.walletSubproviders.SingleKeyProvider).toBe(true)
      expect(!!result.current.walletSubproviders.LedgerProvider).toBe(true)
    })
  })
})
