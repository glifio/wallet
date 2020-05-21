import createHDWalletProvider from './createHDWalletProvider'
import createSingleKeyProvider from './createSingleKeyProvider'
import createLedgerProvider from './createLedgerProvider'

export default rustModule => ({
  HDWalletProvider: createHDWalletProvider(rustModule),
  SingleKeyProvider: createSingleKeyProvider(rustModule),
  LedgerProvider: createLedgerProvider(rustModule)
})
