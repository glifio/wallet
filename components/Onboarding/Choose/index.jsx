import React, { useState } from 'react'
import { Box, IconLedger, StyledATag, Text, Warning } from '../../Shared'
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
          description='We do not recommend you use this account to hold or transact significant sums of Filecoin. This account is for testing purposes only. For significant sums, Glif should only be used with a Ledger hardware wallet.'
          linkDisplay="Why isn't it secure?"
          linkhref='https://coinsutra.com/security-risks-bitcoin-wallets/'
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
          <Hello textAlign='center' mb={1} />
          <Box
            backgroundColor='status.warning.background'
            color='status.warning.foreground'
            borderRadius={2}
            py={2}
            px={3}
            my={3}
          >
            <Text m={0}>
              For your protection, please check that you are visiting
              https://wallet.glif.io
            </Text>
          </Box>
          <Box display='flex' justifyContent='center' flexDirection='column'>
            <Box display='flex' flexWrap='wrap' justifyContent='center' mb={3}>
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
            <ImportWallet
              width='100%'
              maxWidth='614px'
              mb={3}
              alignSelf='center'
              onClick={`${window.location.protocol}//${window.location.host}/investor`}
              glyphAcronym='Is'
              title='Investor Setup'
              description='Investors can setup their accounts here'
            />
            <Box display='flex' flexWrap='wrap' justifyContent='center'>
              <ImportWallet
                onClick={() => onChoose(IMPORT_MNEMONIC)}
                glyphAcronym='Sp'
                title='Import Seed Phrase'
                description='Use your existing seed phrase from Glif or another wallet'
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
