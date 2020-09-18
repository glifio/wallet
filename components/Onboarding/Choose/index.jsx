import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import {
  Box,
  IconLedger,
  Text,
  Title,
  Button,
  Header,
  Warning,
  Glyph,
  Highlight,
} from '../../Shared'
import HeaderGlyph from '../../Shared/Glyph/HeaderGlyph'
import ImportWallet from './Import'
import CreateWallet from './Create'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY
} from '../../../constants'
import { useWalletProvider } from '../../../WalletProvider'

const DevMode = styled(ImportWallet)``

export default () => {
  const { setWalletType } = useWalletProvider()
  // this could be cleaner, but we use this to more easily navigate to/from the warning card
  const [localWalletType, setLocalWalletType] = useState(null)
  const router = useRouter()

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

  const [devMode, setDevMode] = useState(false)
  const [phishingBanner, setPhishingBanner] = useState(false)

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
          flexWrap='wrap'
          minHeight='90vh'
          maxWidth='1440px'
          alignItems='flex-start'
          justifyContent='space-around'
          flexGrow='1'
        >
          { !phishingBanner &&

          <Box position="absolute" display="flex" alignItems="center" justifyContent="space-around" top='0' width='100%' backgroundColor='status.warning.background' minHeight={6} px={3} py={[2,2,0]} zIndex={5}>
          <Text mt={3} lineHeight='140%' m={0}>
                For your protection, please check your browser&apos;s URL bar
                that you&apos;re visiting https://wallet.glif.io
              </Text>
              <Button
                    justifySelf='flex-end'
                    variant='tertiary'
                    title='Close'
                    color='core.black'
                    mx={2}
                    border={0}
                    p={0}
                    onClick={() => setPhishingBanner(true)}
                  >
                    CLOSE
                  </Button>
              </Box>
}
          <Box
            display='flex'
            maxWidth={13}
            width={['100%', '100%', '40%']}
            flexDirection='column'
            alignItems='flex-start'
            alignContent='center'
            mb={4}
            p={4}
          >
            <HeaderGlyph
              alt='Source: https://www.nontemporary.com/post/190437968500'
              text='Wallet'
              imageUrl='/imgwallet.png'
              color='black'
              fill='#000'
              imageOpacity='0.7'
            />

            <Box
              display='flex'
              flexDirection='column'
              mt={[2, 4, 4]}
              alignSelf='center'
              textAlign='left'
            >
              <Title fontSize={5}>
                A lightweight web interface to send and receive Filecoin via your Ledger device
              </Title>
              
              <ImportWallet
                onClick={() => onChoose(LEDGER)}
                Icon={IconLedger}
                title='Login via Ledger Device'
                tag='Most Secure'
                display='flex'
                justifyContent='space-between'
                flexDirection='column'
                my={4}
              />
            </Box>
          </Box>
          <Box
            display='flex'
            maxWidth={13}
            width={['100%', '100%', '40%']}
            flexDirection='column'
            alignItems='flex-start'
            alignContent='center'
            mb={4}
            p={4}
          >
            <HeaderGlyph
              alt='Source: https://www.nontemporary.com/post/190437968500'
              text='Vault'
              imageUrl='/imgvault.png'
              color='core.white'
              fill='#fff'
              imageOpacity='0.9'
            />

            <Box
              display='flex'
              flexDirection='column'
              mt={[2, 4, 4]}
              alignSelf='center'
              textAlign='left'
            >
              <Title fontSize={5}>
              Use your Ledger device to setup and manage your Filecoin SAFT.
              </Title>
              
              <Box display='flex' flexDirection='column' p={2} my={3} bg="#" borderRadius={2} maxWidth={12} alignItems='center' shadow={3} borderColor="core.lightgray" boxShadow={2}>
                <Box my={3}>
              <Title>Filecoin SAFT Investors</Title>
              <Text m={0} maxWidth={11}>
                Securely generate an account to receive your SAFT Filecoin
              </Text>
              </Box>
              <ImportWallet
                mb={4}

                onClick={() => router.push('/vault')}
                glyphAcronym='Ss'
                title='SAFT Setup'
              />
              </Box>
              <Box position="relative" display='flex' flexDirection='column' p={2} my={3} bg="#" borderRadius={2} maxWidth={12} alignItems='center' border={1} borderColor="core.lightgray">
              <Text mt={4} maxWidth={11}>
                Access your SAFT Multisig Vesting Account via your Ledger Device
              </Text>
              <ImportWallet
                opacity="0.25"
                onClick="disabled"
                glyphAcronym='Ms'
                title='Multisig Vesting Account'
              />
              <Text>
              <Highlight fontSize={3} maxWidth={11}>
                Disabled until Mainnet launch
              </Highlight>
              </Text>
              </Box>
              
              
            </Box>
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            width='auto'
            minWidth={11}
            flexGrow='1'
            flexWrap='wrap'
            justifyContent='space-evenly'
            margin='auto'
          >
            <Box
              display='flex'
              justifyContent='flex-start'
              flexDirection='column'
              alignItems='center'
              textAlign='center'
              flexGrow='1'
            >
              
              
              {devMode && (
                <Box
                  display='flex'
                  flexDirection='column'
                  alignSelf='center'
                  bg='background.messageHistory'
                  mt={3}
                  px={3}
                  py={3}
                  border={1}
                  borderRadius={2}
                >
                  <Box display='flex' alignItems='center' m={2} px={2}>
                    <Glyph border={0} acronym='Dm' />
                    <Text ml={4} my={0}>
                      Dev Mode
                    </Text>
                  </Box>
                  <CreateWallet
                    onClick={() => onChoose(CREATE_MNEMONIC)}
                    m={2}
                  />

                  <ImportWallet
                    onClick={() => onChoose(IMPORT_MNEMONIC)}
                    glyphAcronym='Sp'
                    title='Import Seed Phrase'
                    m={2}
                  />
                  <ImportWallet
                    onClick={() => onChoose(IMPORT_SINGLE_KEY)}
                    glyphAcronym='Pk'
                    title='Import Private Key'
                    m={2}
                  />
                  <Button
                    variant='tertiary'
                    title='Close'
                    color='core.black'
                    m={2}
                    border={0}
                    p={0}
                    onClick={() => setDevMode(false)}
                  >
                    CLOSE
                  </Button>
                </Box>
              )}
            </Box>
            {!devMode && (
              <DevMode
                mt={7}
                alignSelf='center'
                justifySelf='flex-end'
                onClick={() => setDevMode(true)}
                glyphAcronym='Dm'
                title='Dev Mode'
              />
            )}
          </Box>
        </Box>
      )}
    </>
  )
}
