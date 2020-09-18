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
          justifyContent='center'
          flexGrow='1'
        >
          { !phishingBanner &&

          <Box display="flex" alignItems="center" justifyContent="space-around" top='0'  backgroundColor='status.warning.background' minHeight={6} px={3} py={[2,2,0]} zIndex={5}borderRadius={2}>
          <Text mt={3} lineHeight='140%' m={0} color="'status.warning.foreground'">
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
          <Box display="flex" 
          flexWrap="wrap" 
          flexGrow={1}   
          alignItems='flex-start'
          justifyContent='space-around'
          flexGrow='1'>
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
              For Filecoin SAFT Investors
              </Title>
              <Title fontSize={5} color="core.darkgray">
              Use your Ledger device to setup and manage your Filecoin SAFT.
              </Title>
              
              <Box display='flex' flexDirection='column' py={3} px={[2,3]} my={3} bg="#" borderRadius={2} maxWidth={12} alignItems='center' shadow={3} borderColor="core.lightgray" boxShadow={2}>
                <Box my={3}>
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
                Access the vesting Filecoin in your SAFT Wallet
              </Text>
              <ImportWallet
                opacity="0.25"
                onClick="disabled"
                glyphAcronym='Sw'
                title='SAFT Wallet'
                mb={4}
              />
              <Box position="absolute" height="100%" width="100%" top="0" left="0" display="flex" alignItems="center" justifyContent="center" fontSize={4} borderRadius={3} backgroundColor='hsl(0 0% 100% / 0.75)' color="core.darkgray">
              <Highlight fontSize={3} py={2}>Disabled until Mainnet launch</Highlight>
              </Box>
              </Box>
              
              
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
              <Title fontSize={5} color="core.darkgray">
                A lightweight web interface to send and receive Filecoin via your Ledger device
              </Title>
              <Text fontSize={3}><Highlight>NB</Highlight>Your private keys never leave your browser, and are erased upon page refresh</Text>
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
            <Box
            
          >
         
              
              {devMode && (
                <Box
                  display='flex'
                  flexDirection='column'
                  alignSelf='center'
                  bg='background.messageHistory'
                  px={3}
                  py={3}
                  border={1}
                  borderRadius={2}
                >
                  <Box display='flex' alignItems='center' m={2} px={2}>
                    <Glyph border={0} acronym='Ta' />
                    <Text ml={4} my={0}>
                      Test Accounts
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
                  />
                   
                </Box>
              )}

            {!devMode && (
              <DevMode
                alignSelf='center'
                justifySelf='flex-end'
                onClick={() => setDevMode(true)}
                glyphAcronym='Ta'
                title='Test Accounts'
              />
            )}
          </Box>
          </Box>
          </Box>
        </Box>
      )}
    </>
  )
}
