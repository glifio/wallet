import { FilecoinNumber } from '@glif/filecoin-number'

/* WALLET TYPES */
export const LEDGER = 'LEDGER'
export const HD_WALLET = 'HD_WALLET'
export const SINGLE_KEY = 'SINGLE_KEY'

/* LOGIN OPTIONS */
export const IMPORT_MNEMONIC = 'IMPORT_MNEMONIC'
export const CREATE_MNEMONIC = 'CREATE_MNEMONIC'
export const IMPORT_SINGLE_KEY = 'IMPORT_SINGLE_KEY'
export const METAMASK = 'METAMASK'

/* API ENDPOINTS */
export const FILSCAN = 'https://api.filscan.io:8700/v0/filscan'
export const FILSCAN_JSONRPC = 'https://api.filscan.io:8700/rpc/v1'
export const FILSCOUT = 'https://filscoutv3api.ipfsunion.cn'
export const FILFOX = 'https://filfox.info/api'

/* NETWORK VARS */
export const MAINNET = 'f'
export const TESTNET = 't'

export const MAINNET_PATH_CODE = 461
export const TESTNET_PATH_CODE = 1

export const EXEC_ACTOR = 'f01'

/* TX METHOD TYPES */
export const SEND = 'SEND'
export const PROPOSE = 'PROPOSE'
export const EXEC = 'EXEC'
/* FILECOIN APP VERSION MIN */
export const LEDGER_VERSION_MAJOR = 0
export const LEDGER_VERSION_MINOR = 18
export const LEDGER_VERSION_PATCH = 2

/* GAS CONSTANTS */
export const emptyGasInfo = {
  estimatedTransactionFee: new FilecoinNumber('0', 'attofil'),
  gasPremium: new FilecoinNumber('0', 'attofil'),
  gasFeeCap: new FilecoinNumber('0', 'attofil'),
  gasLimit: new FilecoinNumber('0', 'attofil')
}

/* STYLE CONSTANTS */
export const SCREEN_MAX_WIDTH = 1440

/* PAGES */
/* eslint-disable no-unused-vars */
export enum PAGE {
  WALLET_HOME = '/home',
  WALLET_SEND = '/send',
  WALLET_CHOOSE_ACCOUNTS = '/home/accounts',
  SPEED_UP = '/speed-up',
  CONNECT_LEDGER = '/connect/ledger',
  CONNECT_BURNER_IMPORT_SEED = '/connect/burner/import-seed',
  CONNECT_BURNER_IMPORT_PK = '/connect/burner/import-private-key',
  CONNECT_BURNER_CREATE_SEED = '/connect/burner/create-seed',
  CONNECT_MM = '/connect/metamask',
  LANDING = '/'
}

// todo #responsiveDesign: decide how to do responsive design
export const RESPONSIVE_BREAKPOINT = 1024
