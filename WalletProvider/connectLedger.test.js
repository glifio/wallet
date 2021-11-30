import Filecoin, { errors } from '@glif/filecoin-wallet-provider'
import connectLedger from './connectLedger'
import { LEDGER } from '../constants'
import reducer, { initialState } from '../WalletProvider/state'

jest.mock('@glif/filecoin-wallet-provider', () => ({
  __esModule: true,
  ...jest.requireActual('@glif/filecoin-wallet-provider'),
  LedgerProvider: jest.fn().mockImplementation(() => {
    return {
      type: 'LEDGER',
      getVersion: jest.fn().mockImplementation(),
      showAddressAndPubKey: jest.fn().mockImplementation(),
      resetTransport: jest.fn(),
      ready: jest.fn().mockImplementation(() => true)
    }
  }),
  TransportWrapper: jest.fn().mockImplementation(() => {
    return {
      connect: () => {}
    }
  })
}))

describe('connectLedger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it returns a ledger wallet provider upon successful connection, when one doesnt exist in state yet', async () => {
    const mockDispatch = jest.fn()
    const provider = await connectLedger(mockDispatch)
    expect(provider instanceof Filecoin).toBe(true)
    expect(mockDispatch).toHaveBeenCalledTimes(3)
    expect(provider.wallet.type).toBe(LEDGER)
  })

  test('it returns a ledger wallet provider upon successful connection, when one exists in state already', async () => {
    const mockDispatch = jest.fn()
    const mockLedgerProvider = {
      type: 'LEDGER_MOCK',
      getVersion: jest.fn().mockImplementation(),
      showAddressAndPubKey: jest.fn().mockImplementation(),
      resetTransport: jest.fn(),
      ready: jest.fn().mockImplementation(() => true)
    }

    const provider = await connectLedger(mockDispatch, mockLedgerProvider)
    expect(provider instanceof Filecoin).toBe(true)
    expect(mockDispatch).toHaveBeenCalledTimes(3)
    expect(provider.wallet.type).toBe('LEDGER_MOCK')
  })

  describe('ledger error state handling', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    // the errors in these tests are simulated
    // if we find new errors, we can add specific test cases to address them
    test('it captures filecoin app not open errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerFilecoinAppNotOpenError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.filecoinAppNotOpen).toBe(true)
    })

    test('it captures ledger device busy errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerDeviceBusyError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.busy).toBe(true)
    })

    test('it captures ledger not found errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerNotFoundError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.connectedFailure).toBe(true)
    })

    test('it captures ledger lost connection error', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerLostConnectionError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.locked).toBe(true)
    })

    test('it captures unsupported transport error', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.TransportNotSupportedError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.transportSupported).toBe(false)
    })

    test('it captures replug errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerReplugError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.replug).toBe(true)
    })

    test('it captures ledger disconnected errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerDisconnectedError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.locked).toBe(true)
    })

    test('it captures ledger in use by another app errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerInUseByAnotherApp()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.inUseByAnotherApp).toBe(true)
    })

    test('it captures ledger device locked errors', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerDeviceLockedError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.locked).toBe(true)
    })

    test('it captures ledger fil app bad version error', async () => {
      let nextState = { ...initialState }
      const mockDispatch = jest.fn().mockImplementation((action) => {
        nextState = reducer(nextState, action)
      })

      const mockLedgerProvider = {
        type: 'LEDGER_MOCK',
        getVersion: jest.fn().mockImplementation(),
        showAddressAndPubKey: jest.fn().mockImplementation(),
        resetTransport: jest.fn(),
        ready: jest.fn().mockImplementation(() => {
          throw new errors.LedgerFilecoinAppBadVersionError()
        })
      }

      await connectLedger(mockDispatch, mockLedgerProvider)
      expect(nextState.ledger.badVersion).toBe(true)
    })
  })
})
