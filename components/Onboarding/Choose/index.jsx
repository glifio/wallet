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
  InlineBox
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
          alignItems='center'
          justifyContent='center'
          flexGrow='1'
        >
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
              fill='black'
            />

            <Box
              display='flex'
              flexDirection='column'
              mt={[2, 4, 4]}
              alignSelf='center'
              textAlign='left'
            >
              <Header>
                A lightweight interface to send and receive Filecoin
              </Header>
              <Title mt={3} lineHeight='140%'>
                <InlineBox
                  backgroundColor='status.warning.background'
                  color='status.warning.foreground'
                  py={1}
                  px={3}
                  mr={2}
                  my={3}
                  fontSize={4}
                  borderRadius={6}
                >
                  Remember
                </InlineBox>
                For your protection, please check your browser&apos;s URL bar
                that you&apos;re visiting https://wallet.glif.io
              </Title>
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
              justifyContent='center'
              flexDirection='column'
              alignItems='center'
              textAlign='center'
              flexGrow='1'
            >
              <Text>Access via</Text>
              <ImportWallet
                onClick={() => onChoose(LEDGER)}
                Icon={IconLedger}
                title='Ledger Device'
                tag='Most Secure'
                display='flex'
                justifyContent='space-between'
                flexDirection='column'
                mb={6}
              />
              <Text mt={0} maxWidth={11}>
                Securely generate an account to receive your SAFT Filecoin
              </Text>
              <ImportWallet
                mb={4}
                alignSelf='center'
                onClick={() => router.push('/vault')}
                glyphAcronym='Ss'
                title='SAFT Setup'
              />

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
