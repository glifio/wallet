import reducer, {
  initialState,
  SET_WALLET_TYPE,
  CREATE_WALLET_PROVIDER,
  WALLET_ERROR,
  CLEAR_ERROR,
  RESET_STATE,
  setWalletType,
  createWalletProvider,
  setError,
  clearError,
  resetLedgerState,
  resetState
} from './state'
import {
  LEDGER_RESET_STATE,
  LEDGER_USER_INITIATED_IMPORT,
  LEDGER_NOT_FOUND,
  LEDGER_CONNECTED,
  LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP,
  LEDGER_LOCKED,
  LEDGER_UNLOCKED,
  LEDGER_FILECOIN_APP_NOT_OPEN,
  LEDGER_FILECOIN_APP_OPEN,
  LEDGER_BUSY,
  LEDGER_REPLUG,
  LEDGER_USED_BY_ANOTHER_APP,
  initialLedgerState
} from '../utils/ledger/ledgerStateManagement'
import { IMPORT_MNEMONIC } from '../constants'

describe('WalletProvider', () => {
  describe('actions', () => {
    test('setWalletType', () => {
      const walletType = IMPORT_MNEMONIC
      const expectedAction = {
        type: SET_WALLET_TYPE,
        payload: { walletType }
      }

      expect(setWalletType(walletType)).toEqual(expectedAction)
    })

    test('createWalletProvider', () => {
      const provider = { fake: 'provider' }
      const expectedAction = {
        type: CREATE_WALLET_PROVIDER,
        payload: { provider }
      }

      expect(createWalletProvider(provider)).toEqual(expectedAction)
    })

    test('setError', () => {
      const errMessage = 'error message'
      const expectedAction = {
        type: WALLET_ERROR,
        error: errMessage
      }

      expect(setError(errMessage)).toEqual(expectedAction)
    })

    test('clearError', () => {
      expect(clearError()).toEqual({ type: CLEAR_ERROR })
    })

    test('resetLedgerState', () => {
      expect(resetLedgerState()).toEqual({ type: LEDGER_RESET_STATE })
    })

    test('resetState', () => {
      expect(resetState()).toEqual({ type: RESET_STATE })
    })
  })

  describe('reducer', () => {
    test('it sets the wallet type', () => {
      const walletType = IMPORT_MNEMONIC
      const nextState = reducer(initialState, setWalletType(walletType))
      expect(nextState.walletType).toBe(IMPORT_MNEMONIC)
    })

    test('it creates the wallet provider', () => {
      const provider = { fake: 'provider' }
      const nextState = reducer(initialState, createWalletProvider(provider))
      expect(JSON.stringify(nextState.walletProvider)).toEqual(
        JSON.stringify(provider)
      )
    })

    test('it stores wallet error', () => {
      const errMsg = 'fake'
      const nextState = reducer(initialState, setError(errMsg))
      expect(nextState.error).toEqual(errMsg)
    })

    test('it clears walletErrors', () => {
      const state = Object.freeze({ ...initialState, error: 'fake' })
      const nextState = reducer(state, clearError())
      expect(nextState.err).toBeFalsy()
    })

    test('it resets state', () => {
      expect(reducer(initialState, resetState())).toEqual(initialState)
    })

    describe('ledger state handlers', () => {
      let postImportInitiationState
      let postConnectedSuccessState
      let establishingConnectionWithFilecoinAppState
      beforeEach(() => {
        postImportInitiationState = reducer(initialState, {
          type: LEDGER_USER_INITIATED_IMPORT
        })
        postConnectedSuccessState = reducer(postImportInitiationState, {
          type: LEDGER_CONNECTED
        })
        establishingConnectionWithFilecoinAppState = reducer(
          postConnectedSuccessState,
          { type: LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP }
        )
      })
      test('ledger user initiated import', () => {
        const {
          ledger: { connecting, connectedFailure }
        } = reducer(initialState, {
          type: LEDGER_USER_INITIATED_IMPORT
        })
        expect(connecting).toEqual(true)
        expect(connectedFailure).toEqual(false)
      })

      test('ledger not found', () => {
        const {
          ledger: { connecting, connectedFailure }
        } = reducer(postImportInitiationState, {
          type: LEDGER_NOT_FOUND
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(true)
      })

      test('ledger connected', () => {
        const {
          ledger: { connecting, connectedFailure, inUseByAnotherApp }
        } = reducer(postImportInitiationState, {
          type: LEDGER_CONNECTED
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(false)
      })

      test('ledger establishing connection with filecoin app', () => {
        const {
          ledger: {
            connecting,
            connectedFailure,
            inUseByAnotherApp,
            filecoinAppNotOpen,
            locked,
            unlocked,
            busy,
            replug
          }
        } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(false)
        expect(filecoinAppNotOpen).toEqual(false)
        expect(locked).toEqual(false)
        expect(unlocked).toEqual(false)
        expect(busy).toEqual(false)
        expect(replug).toEqual(false)
      })

      test('ledger locked', () => {
        const {
          ledger: {
            connecting,
            connectedFailure,
            inUseByAnotherApp,
            filecoinAppNotOpen,
            locked,
            unlocked,
            busy,
            replug
          }
        } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_LOCKED
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(false)
        expect(filecoinAppNotOpen).toEqual(false)
        expect(locked).toEqual(true)
        expect(unlocked).toEqual(false)
        expect(busy).toEqual(false)
        expect(replug).toEqual(false)
      })

      test('ledger unlocked', () => {
        const {
          ledger: {
            connecting,
            connectedFailure,
            inUseByAnotherApp,
            filecoinAppNotOpen,
            locked,
            unlocked,
            busy,
            replug
          }
        } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_UNLOCKED
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(false)
        expect(filecoinAppNotOpen).toEqual(false)
        expect(locked).toEqual(false)
        expect(unlocked).toEqual(true)
        expect(busy).toEqual(false)
        expect(replug).toEqual(false)
      })

      test('ledger filecoin app not open', () => {
        const {
          ledger: {
            connecting,
            connectedFailure,
            inUseByAnotherApp,
            filecoinAppNotOpen,
            locked,
            unlocked,
            busy,
            replug
          }
        } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_FILECOIN_APP_NOT_OPEN
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(false)
        expect(filecoinAppNotOpen).toEqual(true)
        expect(locked).toEqual(false)
        expect(unlocked).toEqual(true)
        expect(busy).toEqual(false)
        expect(replug).toEqual(false)
      })

      test('ledger filecoin app open', () => {
        const {
          ledger: {
            connecting,
            connectedFailure,
            inUseByAnotherApp,
            filecoinAppNotOpen,
            locked,
            unlocked,
            busy,
            replug
          }
        } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_FILECOIN_APP_OPEN
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(false)
        expect(filecoinAppNotOpen).toEqual(false)
        expect(locked).toEqual(false)
        expect(unlocked).toEqual(true)
        expect(busy).toEqual(false)
        expect(replug).toEqual(false)
      })

      test('ledger busy', () => {
        const {
          ledger: {
            connecting,
            connectedFailure,
            inUseByAnotherApp,
            filecoinAppNotOpen,
            locked,
            unlocked,
            busy,
            replug
          }
        } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_BUSY
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(false)
        expect(filecoinAppNotOpen).toEqual(false)
        expect(locked).toEqual(false)
        expect(unlocked).toEqual(false)
        expect(busy).toEqual(true)
        expect(replug).toEqual(false)
      })

      test('ledger replug', () => {
        const {
          ledger: {
            connecting,
            connectedFailure,
            inUseByAnotherApp,
            filecoinAppNotOpen,
            locked,
            unlocked,
            busy,
            replug
          }
        } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_REPLUG
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(false)
        expect(filecoinAppNotOpen).toEqual(false)
        expect(locked).toEqual(false)
        expect(unlocked).toEqual(false)
        expect(busy).toEqual(false)
        expect(replug).toEqual(true)
      })

      test('ledger replug', () => {
        const {
          ledger: {
            connecting,
            connectedFailure,
            inUseByAnotherApp,
            filecoinAppNotOpen,
            locked,
            unlocked,
            busy,
            replug
          }
        } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_USED_BY_ANOTHER_APP
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(false)
        expect(inUseByAnotherApp).toEqual(true)
        expect(filecoinAppNotOpen).toEqual(false)
        expect(locked).toEqual(false)
        expect(unlocked).toEqual(false)
        expect(busy).toEqual(false)
        expect(replug).toEqual(false)
      })

      test('ledger replug', () => {
        const { ledger } = reducer(establishingConnectionWithFilecoinAppState, {
          type: LEDGER_RESET_STATE
        })
        expect(JSON.stringify(ledger)).toEqual(
          JSON.stringify(initialLedgerState)
        )
      })
    })
  })
})
