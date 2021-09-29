import { Message } from '@glif/filecoin-message'
import mockRustModule from '@zondax/filecoin-signing-tools'

import {
  mockGetAddressAndPubKey,
  mockSign
} from '../../test-utils/mocks/mock-ledger-filecoin'
import { LEDGER, TESTNET } from '../../constants'
import createLedgerProvider from './createLedgerProvider'

const followsSubproviderInterface = (subprovider) =>
  !!(subprovider.sign && subprovider.getAccounts && subprovider.type)

describe('createLedgerProvider', () => {
  beforeEach(jest.clearAllMocks)

  test('it returns a ledger subprovider that follows the wallet subprovider interface', () => {
    const LedgerProvider = createLedgerProvider(mockRustModule)
    const ledgerProvider = LedgerProvider({})
    expect(followsSubproviderInterface(ledgerProvider)).toBe(true)
    expect(ledgerProvider.type).toBe(LEDGER)
  })

  describe('LedgerProvider', () => {
    beforeEach(jest.clearAllMocks)
    test('it will throw an error if two simultaneous calls are made', async () => {
      const LedgerProvider = createLedgerProvider(mockRustModule)
      const ledgerProvider = LedgerProvider({})
      ledgerProvider.getVersion()
      const funcShouldThrow = async () =>
        await ledgerProvider.getAccounts(TESTNET, 0, 5)
      return expect(funcShouldThrow).rejects.toThrow(
        'Ledger is busy, please check device, or quit Filecoin app and unplug/replug your device.'
      )
    })

    describe('sign', () => {
      beforeEach(jest.clearAllMocks)

      test('it calls the ledger-filecoin-js sign method', async () => {
        const msg = new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: 0
        })
        const LedgerProvider = createLedgerProvider(mockRustModule)
        const ledgerProvider = LedgerProvider({})
        await ledgerProvider.sign(msg, "m/44'/461'/0/0/2")
        expect(mockSign).toHaveBeenCalled()
      })
    })

    describe('getAccounts', () => {
      beforeEach(jest.clearAllMocks)

      test('it returns an array of accounts', async () => {
        const LedgerProvider = createLedgerProvider(mockRustModule)
        const ledgerProvider = LedgerProvider({})
        const accounts = await ledgerProvider.getAccounts(TESTNET, 0, 5)
        expect(accounts.length).toBe(5)
        expect(mockGetAddressAndPubKey).toHaveBeenCalledTimes(5)
      })

      test('it generates accounts with the right, hardened paths', async () => {
        const LedgerProvider = createLedgerProvider(mockRustModule)
        const ledgerProvider = LedgerProvider({})
        await ledgerProvider.getAccounts(TESTNET, 0, 5)
        mockGetAddressAndPubKey.mock.calls.forEach(([path], walletIdx) => {
          // check to make sure the path fits m/44'/1'/0'/0/0
          path.split('/').forEach((v, i) => {
            // expect apostrophe at the end if its in the first 3 vals after "m"
            if (i === 0) expect(v).toBe('m')
            else if (i < 4) expect(v[v.length - 1]).toBe("'")
            else expect(v[v.length - 1]).not.toBe("'")

            if (i === 5) expect(v).toBe(walletIdx.toString())
          })
        })
      })
    })
  })
})
