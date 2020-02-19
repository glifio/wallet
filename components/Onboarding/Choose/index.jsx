import React from 'react'
import { Box } from '@openworklabs/filecoin-wallet-styleguide'
import ImportWallet from './Import'
import CreateWallet from './Create'
import Hello from './Hello'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY
} from '../../../constants'
import { useWalletProvider } from '../../../WalletProvider'

export default () => {
  const { setWalletType } = useWalletProvider()
  return (
    <Box
      display='flex'
      justifyContent='center'
      flexDirection='row'
      alignItems='flex-end'
    >
      <Box display='flex' flexDirection='column' mr={2}>
        <Hello mb={4} />
        <ImportWallet
          onClick={() => setWalletType(LEDGER)}
          glyphAcronym='Ld'
          title='Ledger Device'
          description='Use Filament to access your Ledger device'
          mb={2}
          mt={2}
        />
        <ImportWallet
          onClick={() => setWalletType(IMPORT_MNEMONIC)}
          glyphAcronym='Sp'
          title='Import Seed Phrase'
          description='Use your existing seed phrase'
          mt={2}
        />
      </Box>
      <Box display='flex' flexDirection='column' ml={2}>
        <CreateWallet onClick={() => setWalletType(CREATE_MNEMONIC)} mb={2} />
        <ImportWallet
          onClick={() => setWalletType(IMPORT_SINGLE_KEY)}
          glyphAcronym='Pk'
          title='Import Private Key'
          description='Use your existing private key'
          mt={2}
        />
      </Box>
    </Box>
  )
}
