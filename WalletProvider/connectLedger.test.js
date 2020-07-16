import connectLedger from './connectLedger'
import subProviders from '../test-utils/mocks/mock-wallet-subproviders'
import MockWalletProvider from '../test-utils/mocks/mock-wallet-provider'
import { LEDGER } from '../constants'
import reducer, { initialState } from '../WalletProvider/state'

jest.mock('@ledgerhq/hw-transport-webusb')

describe('connectLedger', () => {
  beforeEach(jest.clearAllMocks)

  test('it returns a ledger wallet provider upon successful connection', async () => {
    const mockDispatch = jest.fn()
    const provider = await connectLedger(
      mockDispatch,
      subProviders.LedgerProvider
    )
    expect(provider).toBeInstanceOf(MockWalletProvider)
    expect(provider.wallet.type).toBe(LEDGER)
  })

  describe('ledger error state handling', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    // the errors in these tests are simulated
    // if we find new errors, we can add specific test cases to address them
    test('it captures ledger in use by another app errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation(action => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = () => {
        throw new Error('unable to claim interface.')
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.inUseByAnotherApp).toBe(true)
    })

    test('it captures transport errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation(action => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = () => {
        throw new Error('transporterror: invalid channel')
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.replug).toBe(true)
    })

    test('it captures no device selected errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation(action => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = () => {
        throw new Error('no device selected')
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.userImportFailure).toBe(true)
      expect(nextState.ledger.connectedFailure).toBe(true)
    })

    test('it captures ledger device locked or busy errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation(action => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = () => {
        return {
          getVersion: () => {
            throw new Error('ledger device locked or busy')
          }
        }
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.busy).toBe(true)
    })

    test('it captures ledger filecoin app not open errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation(action => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = () => {
        return {
          getVersion: () => {
            throw new Error('app does not seem to be open')
          }
        }
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.unlocked).toBe(true)
      expect(nextState.ledger.filecoinAppNotOpen).toBe(true)
    })
  })
})
