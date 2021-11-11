import { FilecoinNumber } from '@glif/filecoin-number'
import Filecoin from '@glif/filecoin-wallet-provider'
import {
  LedgerActionType,
  LedgerState
} from '../utils/ledger/ledgerStateManagement'

export type WalletActionType =
  | 'SET_WALLET_TYPE'
  | 'CREATE_WALLET_PROVIDER'
  | 'WALLET_ERROR'
  | 'CLEAR_ERROR'
  | 'RESET_STATE'
  | 'WALLET_LIST'
  | 'SWITCH_WALLET'
  | 'UPDATE_BALANCE'

export type WalletType = 'LEDGER' | 'HD_WALLET' | 'SINGLE_KEY'

export type WalletProviderAction = {
  type: WalletActionType | LedgerActionType
  payload?: object
  error?: string
}

export type Wallet = {
  path: string
  balance: FilecoinNumber
  address: string
  type?: WalletType
}

export type WalletProviderState = {
  walletType: WalletType | null
  walletProvider: Filecoin | null
  ledger: LedgerState
  wallets: Wallet[]
  selectedWalletIdx: number
  error: string
}
