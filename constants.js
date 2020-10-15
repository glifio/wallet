import { FilecoinNumber } from '@glif/filecoin-number'

/* WALLET TYPES */
export const LEDGER = 'LEDGER'
export const HD_WALLET = 'HD_WALLET'
export const SINGLE_KEY = 'SINGLE_KEY'

export const IMPORT_MNEMONIC = 'IMPORT_MNEMONIC'
export const CREATE_MNEMONIC = 'CREATE_MNEMONIC'
export const IMPORT_SINGLE_KEY = 'IMPORT_SINGLE_KEY'

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

/* MSIG PL SIGNERS */
export const PL_SIGNERS = new Set([
  'f020484',
  'f022215',
  'f023047',
  'f022408',
  'f0105',
  'f125nlfn4lwl7ldt4gwfas5furnwafwqgd2our6oa',
  'f16j5fivw6dq2h3uujq47joz36on24wfalofxmtvi',
  'f1yr7w7y5nia2zmzkw6yvxygj2pctwv3le2l3zccq',
  'f1figgwd5npr2jyw67u75qhjoyv3xf3jq5vwmmq5i',
  'f1ovvm6oilbdsvbw27jhil3pcywrjuwiv5uzagq6i',
  'f010361',
  't020484',
  't022215',
  't023047',
  't022408',
  't0105',
  't125nlfn4lwl7ldt4gwfas5furnwafwqgd2our6oa',
  't16j5fivw6dq2h3uujq47joz36on24wfalofxmtvi',
  't1yr7w7y5nia2zmzkw6yvxygj2pctwv3le2l3zccq',
  't1figgwd5npr2jyw67u75qhjoyv3xf3jq5vwmmq5i',
  't1ovvm6oilbdsvbw27jhil3pcywrjuwiv5uzagq6i'
])
