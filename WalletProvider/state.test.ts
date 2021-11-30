import { FilecoinNumber } from '@glif/filecoin-number'
import Filecoin, { WalletSubProvider } from '@glif/filecoin-wallet-provider'
import clonedeep from 'lodash.clonedeep'
import { Message, SignedLotusMessage } from '@glif/filecoin-message'
import reducer, {
  initialState,
  setLoginOption,
  createWalletProvider,
  setError,
  clearError,
  resetLedgerState,
  resetState,
  walletList,
  switchWallet,
  updateBalance
} from './state'
import { initialLedgerState } from '../utils/ledger/ledgerStateManagement'
import { IMPORT_MNEMONIC, SINGLE_KEY } from '../constants'
import { WalletProviderAction } from './types'

const mockSubProvider: WalletSubProvider = {
  type: 'MOCK',
  getAccounts: async (): Promise<string[]> => {
    return []
  },
  sign: async (): Promise<SignedLotusMessage> => {
    return {
      Message: new Message({
        to: '',
        from: '',
        value: '0',
        method: 0,
        nonce: 0
      }).toLotusType(),
      Signature: {
        Type: 1,
        Data: 'string'
      }
    }
  }
}

describe('WalletProvider', () => {
  describe('actions', () => {
    test('walletList', () => {
      const wallets = [
        {
          address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
          balance: new FilecoinNumber('1', 'fil'),
          path: ''
        }
      ]

      const expectedAction = {
        type: 'WALLET_LIST',
        payload: {
          wallets
        }
      }

      expect(walletList(wallets)).toEqual(expectedAction)
    })

    test('switchWallet', () => {
      const index = 1
      const expectedAction = {
        type: 'SWITCH_WALLET',
        payload: {
          index
        }
      }

      expect(switchWallet(index)).toEqual(expectedAction)
    })

    test('updateBalance', () => {
      const walletIdx = 1
      const balance = new FilecoinNumber('1', 'fil')
      const expectedAction = {
        type: 'UPDATE_BALANCE',
        payload: {
          balance,
          walletIdx
        }
      }

      expect(updateBalance(balance, walletIdx)).toEqual(expectedAction)
    })

    test('setLoginOption', () => {
      const loginOption = IMPORT_MNEMONIC
      const expectedAction: WalletProviderAction = {
        type: 'SET_LOGIN_OPTION',
        payload: { loginOption }
      }

      expect(setLoginOption(loginOption)).toEqual(expectedAction)
    })

    test('createWalletProvider', () => {
      const provider = new Filecoin(mockSubProvider)
      const expectedAction: WalletProviderAction = {
        type: 'CREATE_WALLET_PROVIDER',
        payload: { provider }
      }

      expect(createWalletProvider(provider)).toEqual(expectedAction)
    })

    test('setError', () => {
      const errMessage = 'error message'
      const expectedAction: WalletProviderAction = {
        type: 'WALLET_ERROR',
        error: errMessage
      }

      expect(setError(errMessage)).toEqual(expectedAction)
    })

    test('clearError', () => {
      expect(clearError()).toEqual({ type: 'CLEAR_ERROR' })
    })

    test('resetLedgerState', () => {
      expect(resetLedgerState()).toEqual({ type: 'LEDGER_RESET_STATE' })
    })

    test('resetState', () => {
      expect(resetState()).toEqual({ type: 'RESET_STATE' })
    })
  })

  describe('reducer', () => {
    describe('walletList', () => {
      test('it adds wallets to redux store', () => {
        const wallets = [
          {
            address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          },
          {
            address: 't1jalfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          }
        ]

        const expectedState = {
          ...initialState,
          selectedWalletIdx: 0,
          wallets
        }

        const nextState = reducer(initialState, walletList(wallets))

        expect(JSON.stringify(nextState)).toEqual(JSON.stringify(expectedState))
      })

      test('it keeps the selectedWalletIdx if one is already set', () => {
        const wallets = [
          {
            address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          },
          {
            address: 't1jdlfl73voafblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          }
        ]

        const newInitialState = clonedeep({
          ...initialState,
          selectedWalletIdx: 3
        })

        const expectedState = {
          ...initialState,
          selectedWalletIdx: 3,
          wallets
        }

        const nextState = reducer(newInitialState, walletList(wallets))

        expect(JSON.stringify(nextState)).toEqual(JSON.stringify(expectedState))
      })

      test('it adds the wallets to store when some already exist', () => {
        const existingWallets = [
          {
            address: 't1zdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          },
          {
            address: 't1jflfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          }
        ]

        const newWallets = [
          {
            address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          },
          {
            address: 't1jdlfl73voaiblsvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          }
        ]

        const newInitialState = clonedeep({
          ...initialState,
          wallets: existingWallets
        })

        const expectedState = {
          ...initialState,
          selectedWalletIdx: 0,
          wallets: [...existingWallets, ...newWallets]
        }
        const nextState = reducer(newInitialState, walletList(newWallets))

        expect(JSON.stringify(nextState)).toEqual(JSON.stringify(expectedState))
      })

      test('it removes wallet duplicates', () => {
        const dupWallets = [
          {
            address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          },
          {
            address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: SINGLE_KEY
          }
        ]

        const newInitialState = clonedeep({
          ...initialState,
          wallets: dupWallets
        })

        const expectedState = {
          ...initialState,
          selectedWalletIdx: 0,
          wallets: [dupWallets[0]]
        }

        const nextState = reducer(newInitialState, walletList(dupWallets))

        expect(JSON.stringify(nextState)).toEqual(JSON.stringify(expectedState))
      })
    })

    describe('switchWallet', () => {
      test('it updates the selected wallet index in state', () => {
        const selectedWalletIdx = 1
        const expectedState = { ...initialState, selectedWalletIdx }

        const nextState = reducer(initialState, switchWallet(selectedWalletIdx))

        expect(JSON.stringify(nextState)).toEqual(JSON.stringify(expectedState))
      })
    })

    describe('updateBalance', () => {
      test('it updates the balance of the wallet at walletIdx', () => {
        const selectedWalletIdx = 1
        const wallets = [
          {
            address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: ''
          },
          {
            address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
            balance: new FilecoinNumber('1', 'fil'),
            path: ''
          }
        ]

        const newInitialState = clonedeep({
          ...initialState,
          wallets,
          selectedWalletIdx
        })

        const newBalance = new FilecoinNumber('2', 'fil')

        const nextState = reducer(
          newInitialState,
          updateBalance(newBalance, selectedWalletIdx)
        )

        expect(nextState.wallets[selectedWalletIdx].balance.toFil()).toBe('2')
        expect(nextState.selectedWalletIdx).toBe(selectedWalletIdx)
      })
    })
    test('it sets the login option', () => {
      const loginOption = IMPORT_MNEMONIC
      const nextState = reducer(initialState, setLoginOption(loginOption))
      expect(nextState.loginOption).toBe(IMPORT_MNEMONIC)
    })

    test('it creates the wallet provider', () => {
      const nextState = reducer(
        initialState,
        createWalletProvider(new Filecoin(mockSubProvider))
      )

      expect(nextState.walletProvider.wallet.type).toEqual('MOCK')
    })

    test('it stores wallet error', () => {
      const errMsg = 'fake'
      const nextState = reducer(initialState, setError(errMsg))
      expect(nextState.error).toEqual(errMsg)
    })

    test('it clears walletErrors', () => {
      const state = Object.freeze({ ...initialState, error: 'fake' })
      const nextState = reducer(state, clearError())
      expect(nextState.error).toBeFalsy()
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
          type: 'LEDGER_USER_INITIATED_IMPORT'
        })
        postConnectedSuccessState = reducer(postImportInitiationState, {
          type: 'LEDGER_CONNECTED'
        })
        establishingConnectionWithFilecoinAppState = reducer(
          postConnectedSuccessState,
          { type: 'LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP' }
        )
      })
      test('ledger user initiated import', () => {
        const {
          ledger: { connecting, connectedFailure }
        } = reducer(initialState, {
          type: 'LEDGER_USER_INITIATED_IMPORT'
        })
        expect(connecting).toEqual(true)
        expect(connectedFailure).toEqual(false)
      })

      test('ledger not found', () => {
        const {
          ledger: { connecting, connectedFailure }
        } = reducer(postImportInitiationState, {
          type: 'LEDGER_NOT_FOUND'
        })
        expect(connecting).toEqual(false)
        expect(connectedFailure).toEqual(true)
      })

      test('ledger connected', () => {
        const {
          ledger: { connecting, connectedFailure, inUseByAnotherApp }
        } = reducer(postImportInitiationState, {
          type: 'LEDGER_CONNECTED'
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
          type: 'LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP'
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
          type: 'LEDGER_LOCKED'
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
          type: 'LEDGER_UNLOCKED'
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
          type: 'LEDGER_FILECOIN_APP_NOT_OPEN'
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
          type: 'LEDGER_FILECOIN_APP_OPEN'
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
          type: 'LEDGER_BUSY'
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
          type: 'LEDGER_REPLUG'
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
          type: 'LEDGER_USED_BY_ANOTHER_APP'
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
          type: 'LEDGER_RESET_STATE'
        })
        expect(JSON.stringify(ledger)).toEqual(
          JSON.stringify(initialLedgerState)
        )
      })

      test('bad version', () => {
        const { ledger } = reducer(establishingConnectionWithFilecoinAppState, {
          type: 'LEDGER_BAD_VERSION'
        })
        expect(ledger.badVersion).toBe(true)
      })
    })
  })
})
