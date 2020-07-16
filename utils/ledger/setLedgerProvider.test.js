import { setLedgerProvider } from './setLedgerProvider'
import subProviders from '../../test-utils/mocks/mock-wallet-subproviders'
import MockWalletProvider from '../../test-utils/mocks/mock-wallet-provider'
import { LEDGER } from '../../constants'

jest.mock('@ledgerhq/hw-transport-webusb')

const mockDispatch = jest.fn()

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
