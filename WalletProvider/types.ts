import { FilecoinNumber } from '@glif/filecoin-number'
import Filecoin from '@glif/filecoin-wallet-provider'
import {
  LedgerActionType,
  LedgerState
} from '../utils/ledger/ledgerStateManagement'

export type WalletActionType =
  | 'SET_LOGIN_OPTION'
  | 'CREATE_WALLET_PROVIDER'
  | 'WALLET_ERROR'
  | 'CLEAR_ERROR'
  | 'RESET_STATE'
  | 'WALLET_LIST'
  | 'SWITCH_WALLET'
  | 'UPDATE_BALANCE'

export type LoginOption =
  | 'IMPORT_MNEMONIC'
  | 'CREATE_MNEMONIC'
  | 'IMPORT_SINGLE_KEY'
  | 'LEDGER'

export type WalletProviderAction = {
  type: WalletActionType | LedgerActionType
  error?: string
  payload?: any
}

export type Wallet = {
  path: string
  balance: FilecoinNumber
  address: string
}

export type WalletProviderState = {
  loginOption: LoginOption
  walletProvider: Filecoin | null
  ledger: LedgerState
  wallets: Wallet[]
  selectedWalletIdx: number
  error: string
}
