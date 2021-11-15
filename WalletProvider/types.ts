import { FilecoinNumber } from '@glif/filecoin-number'
import Filecoin, { WalletSubProvider } from '@glif/filecoin-wallet-provider'
import Transport from '@ledgerhq/hw-transport'
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

export type LedgerVersion = {
  return_code: number
  error_message: string
  // ///
  test_mode: boolean
  major: number
  minor: number
  patch: number
  device_locked: boolean
  target_id: string
}

export type LedgerSubProvider = WalletSubProvider & {
  getVersion: () => Promise<LedgerVersion>
  showAddressAndPubKey: (_: string) => Promise<string | Error>
  resetTransport: (_: Transport) => Promise<void>
}
