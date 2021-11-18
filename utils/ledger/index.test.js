import {
  checkLedgerConfiguration,
  setLedgerProvider
} from './setLedgerProvider'
import subProviders from '../../test-utils/mocks/mock-wallet-subproviders'
import MockWalletProvider from '../../test-utils/mocks/mock-wallet-provider'
import {
  LEDGER,
  LEDGER_VERSION_MAJOR,
  LEDGER_VERSION_MINOR,
  LEDGER_VERSION_PATCH
} from '../../constants'
import badVersion from './badVersion'

const mockDispatch = jest.fn()

describe('Ledger utils', () => {
  describe('setLedgerProvider', () => {
    beforeEach(jest.clearAllMocks)

    test('it returns a ledger wallet provider upon successful connection', async () => {
      const provider = await setLedgerProvider(
        mockDispatch,
        subProviders.LedgerProvider
      )

      expect(provider).toBeInstanceOf(MockWalletProvider)
      expect(provider.wallet.type).toBe(LEDGER)
      // make sure we have at least 1 create wallet provider call in the list of calls
      expect(
        mockDispatch.mock.calls.filter(
          ([mockAction]) => mockAction.type === 'CREATE_WALLET_PROVIDER'
        ).length === 1
      ).toBe(true)
    })
  })

  describe('checkLedgerConfiguration', () => {
    beforeEach(jest.clearAllMocks)

    test('it returns true if the device is open with the filecoin app open', async () => {
      const mockProvider = {
        wallet: {
          getVersion: () => ({
            device_locked: false,
            major: LEDGER_VERSION_MAJOR,
            minor: LEDGER_VERSION_MINOR,
            patch: LEDGER_VERSION_PATCH
          })
        }
      }

      const configured = await checkLedgerConfiguration(
        mockDispatch,
        mockProvider
      )
      expect(configured).toBe(true)
      expect(
        mockDispatch.mock.calls.filter(
          ([mockAction]) =>
            mockAction.type === 'LEDGER_FILECOIN_APP_OPEN' ||
            mockAction.type === 'LEDGER_UNLOCKED'
        ).length === 2
      ).toBe(true)
    })

    test('it handles device locked response', async () => {
      const mockProvider = {
        wallet: {
          getVersion: () => ({
            device_locked: true,
            major: LEDGER_VERSION_MAJOR,
            minor: LEDGER_VERSION_MINOR,
            patch: LEDGER_VERSION_PATCH
          })
        }
      }

      const configured = await checkLedgerConfiguration(
        mockDispatch,
        mockProvider
      )
      expect(configured).toBe(false)
      expect(
        mockDispatch.mock.calls.filter(
          ([mockAction]) => mockAction.type === 'LEDGER_LOCKED'
        ).length === 1
      ).toBe(true)
    })

    test('it handles thrown transport errors', async () => {
      const mockProvider = {
        wallet: {
          getVersion: () => {
            throw new Error('transporterror: invalid channel')
          }
        }
      }

      const configured = await checkLedgerConfiguration(
        mockDispatch,
        mockProvider
      )
      expect(configured).toBe(false)
      expect(
        mockDispatch.mock.calls.filter(
          ([mockAction]) => mockAction.type === 'LEDGER_REPLUG'
        ).length === 1
      ).toBe(true)
    })

    test('it handles thrown device locked or busy', async () => {
      const mockProvider = {
        wallet: {
          getVersion: () => {
            throw new Error('ledger device locked or busy')
          }
        }
      }

      const configured = await checkLedgerConfiguration(
        mockDispatch,
        mockProvider
      )
      expect(configured).toBe(false)
      expect(
        mockDispatch.mock.calls.filter(
          ([mockAction]) => mockAction.type === 'LEDGER_BUSY'
        ).length === 1
      ).toBe(true)
    })

    test('it handles app not open errors', async () => {
      const mockProvider = {
        wallet: {
          getVersion: () => {
            throw new Error('app does not seem to be open')
          }
        }
      }

      const configured = await checkLedgerConfiguration(
        mockDispatch,
        mockProvider
      )
      expect(configured).toBe(false)
      expect(
        mockDispatch.mock.calls.filter(
          ([mockAction]) => mockAction.type === 'LEDGER_FILECOIN_APP_NOT_OPEN'
        ).length === 1
      ).toBe(true)
    })

    test('it handles unknown errors', async () => {
      const mockProvider = {
        wallet: {
          getVersion: () => {
            throw new Error('fdsafdsafdafdsafdsafd')
          }
        }
      }

      const configured = await checkLedgerConfiguration(
        mockDispatch,
        mockProvider
      )
      expect(configured).toBe(false)
      expect(
        mockDispatch.mock.calls.filter(
          ([mockAction]) => mockAction.type === 'LEDGER_REPLUG'
        ).length === 1
      ).toBe(true)
    })
  })
})

describe('badVersion', () => {
  test('it returns true if the version is below the LEDGER_VERSION_MAJOR LEDGER_VERSION_MINOR or LEDGER_VERSION_PATCH', () => {
    expect(
      badVersion({
        major: LEDGER_VERSION_MAJOR,
        minor: LEDGER_VERSION_MINOR,
        patch: LEDGER_VERSION_PATCH - 1
      })
    ).toBe(true)
    expect(
      badVersion({
        major: LEDGER_VERSION_MAJOR,
        minor: LEDGER_VERSION_MINOR - 1,
        patch: LEDGER_VERSION_PATCH
      })
    ).toBe(true)
  })

  test('it returns false if the version is at or above the LEDGER_VERSION_MAJOR LEDGER_VERSION_MINOR or LEDGER_VERSION_PATCH', () => {
    expect(
      badVersion({
        major: LEDGER_VERSION_MAJOR,
        minor: LEDGER_VERSION_MINOR,
        patch: LEDGER_VERSION_PATCH
      })
    ).toBe(false)
    expect(
      badVersion({
        major: LEDGER_VERSION_MAJOR + 1,
        minor: LEDGER_VERSION_MINOR + 1,
        patch: LEDGER_VERSION_PATCH + 1
      })
    ).toBe(false)
  })
})
