import React from 'react'
import { Box, IconLedger } from '../../Shared'
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
      flexDirection='column'
      alignItems='center'
      minHeight='90vh'
    >
      <Hello textAlign='center' mb={4} />

      <Box display='flex' justifyContent='center' flexDirection='column' mr={3}>
        <Box display='flex' flexWrap='wrap' justifyContent='center' mb={5}>
          <ImportWallet
            onClick={() => setWalletType(LEDGER)}
            Icon={IconLedger}
            title='Ledger Device'
            description='Hardware wallets protect your private information'
            tag='Most Secure'
            m={2}
            display='flex'
            justifyContent='space-between'
            flexDirection='column'
          />
          <CreateWallet onClick={() => setWalletType(CREATE_MNEMONIC)} m={2} />
        </Box>
        <Box display='flex' flexWrap='wrap' justifyContent='center'>
          <ImportWallet
            onClick={() => setWalletType(IMPORT_MNEMONIC)}
            glyphAcronym='Sp'
            title='Import Seed Phrase'
            m={2}
          />
          <ImportWallet
            onClick={() => setWalletType(IMPORT_SINGLE_KEY)}
            glyphAcronym='Pk'
            title='Import Private Key'
            m={2}
          />
        </Box>
      </Box>
    </Box>
  )
}
