import React, { useState } from 'react'
import { Box, IconLedger, Warning } from '../../Shared'
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
  // this could be cleaner, but we use this to more easily navigate to/from the warning card
  const [localWalletType, setLocalWalletType] = useState(null)

  const onChoose = type => {
    if (
      !localWalletType &&
      (type === CREATE_MNEMONIC ||
        type === IMPORT_MNEMONIC ||
        type === IMPORT_SINGLE_KEY)
    ) {
      setLocalWalletType(type)
    } else if (localWalletType) {
      setWalletType(localWalletType)
    } else {
      setWalletType(type)
    }
  }

  return (
    <>
      {localWalletType ? (
        <Warning
          title='Warning'
          description='We do not recommend you use any browser-based wallet to transact large sums of Filecoin. Glif should only be used with a Ledger hardware wallet.'
          linkDisplay="Why isn't it secure?"
          linkhref='https://www.google.com/chrome'
          onBack={() => setLocalWalletType(null)}
          onAccept={onChoose}
        />
      ) : (
        <Box
          display='flex'
          justifyContent='center'
          flexDirection='column'
          alignItems='center'
          minHeight='90vh'
        >
          <Hello textAlign='center' mb={4} />

          <Box
            display='flex'
            justifyContent='center'
            flexDirection='column'
            mr={3}
          >
            <Box display='flex' flexWrap='wrap' justifyContent='center' mb={5}>
              <ImportWallet
                onClick={() => onChoose(LEDGER)}
                Icon={IconLedger}
                title='Ledger Device'
                description='Use your Ledger device'
                tag='Most Secure'
                m={2}
                height='240px'
                display='flex'
                justifyContent='space-between'
                flexDirection='column'
              />
              <CreateWallet onClick={() => onChoose(CREATE_MNEMONIC)} m={2} />
            </Box>
            <Box display='flex' flexWrap='wrap' justifyContent='center'>
              <ImportWallet
                onClick={() => onChoose(IMPORT_MNEMONIC)}
                glyphAcronym='Sp'
                title='Import Seed Phrase'
                description='Use your existing seed phrase'
                m={2}
              />
              <ImportWallet
                onClick={() => onChoose(IMPORT_SINGLE_KEY)}
                glyphAcronym='Pk'
                title='Import Private Key'
                description='Use your existing private key'
                m={2}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}
