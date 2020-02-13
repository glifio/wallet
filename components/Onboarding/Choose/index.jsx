import React from 'react'
import { useDispatch } from 'react-redux'
import { Box } from '@openworklabs/filecoin-wallet-styleguide'
import ImportWallet from './Import'
import CreateWallet from './Create'
import Hello from './Hello'
import { setWalletType } from '../../../store/actions'
import { LEDGER, IMPORT_SEED, CREATE, IMPORT_PK } from '../../../constants'

export default () => {
  const dispatch = useDispatch()
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
          onClick={() => dispatch(setWalletType(LEDGER))}
          glyphAcronym='Ld'
          title='Ledger Device'
          description='Use Filament to access your Ledger device'
          mb={2}
          mt={2}
        />
        <ImportWallet
          onClick={() => dispatch(setWalletType(IMPORT_SEED))}
          glyphAcronym='Sp'
          title='Import Seed Phrase'
          description='Use your existing seed phrase'
          mt={2}
        />
      </Box>
      <Box display='flex' flexDirection='column' ml={2}>
        <CreateWallet onClick={() => dispatch(setWalletType(CREATE))} mb={2} />
        <ImportWallet
          onClick={() => dispatch(setWalletType(IMPORT_PK))}
          glyphAcronym='Pk'
          title='Import Private Key'
          description='Use your existing private key'
          mt={2}
        />
      </Box>
    </Box>
  )
}
