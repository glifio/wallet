import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  IconLedger,
  Text,
  Title,
  Header,
  Button,
  Warning,
  useWalletProvider,
  LoginOption
} from '@glif/react-components'
import HeaderGlyph from '../../Shared/Glyph/HeaderGlyph'
import ImportWallet from './Import'
import CreateWallet from './Create'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY,
  SCREEN_MAX_WIDTH,
  PAGE
} from '../../../constants'
import ExpandableBox from './ExpandableBox'
import { navigate } from '../../../utils/urlParams'

export default function Choose() {
  const { setLoginOption } = useWalletProvider()
  // this could be cleaner, but we use this to more easily navigate to/from the warning card
  const [localLoginOption, setLocalLoginOption] = useState<LoginOption | null>(
    null
  )
  const router = useRouter()

  const onChoose = (loginOption: LoginOption) => {
    if (
      !localLoginOption &&
      (loginOption === CREATE_MNEMONIC ||
        loginOption === IMPORT_MNEMONIC ||
        loginOption === IMPORT_SINGLE_KEY)
    ) {
      setLocalLoginOption(loginOption)
    } else if (localLoginOption) {
      setLoginOption(localLoginOption)
    } else {
      setLoginOption(loginOption)
    }
  }

  const [phishingBanner, setPhishingBanner] = useState(false)

  return (
    <>
      {localLoginOption ? (
        <Box display='flex' flexDirection='column' justifyContent='center'>
          <Warning
            title='Warning'
            description='We do not recommend you use this account to hold or transact significant sums of Filecoin. This account is for testing purposes only. For significant sums, Glif should only be used with a Ledger hardware wallet.'
            linkDisplay="Why isn't it secure?"
            linkhref='https://coinsutra.com/security-risks-bitcoin-wallets/'
            onBack={() => setLocalLoginOption(null)}
            onAccept={onChoose}
          />
        </Box>
      ) : (
        <Box
          display='flex'
          flexWrap='wrap'
          minHeight='90vh'
          maxWidth={`${SCREEN_MAX_WIDTH}px`}
          justifyContent='center'
          flexGrow='1'
        >
          {!phishingBanner && (
            <Box
              position='absolute'
              display='block'
              top='0'
              backgroundColor='status.warning.background'
              width='100%'
              minHeight={6}
              px={3}
              py={[2, 2, 0]}
              zIndex={5}
              borderBottomLeftRadius={1}
              borderBottomRightRadius={1}
            >
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-around'
                maxWidth={`${SCREEN_MAX_WIDTH}px`}
              >
                <Text
                  mt={3}
                  lineHeight='140%'
                  m={0}
                  color="'status.warning.foreground'"
                >
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
            </Box>
          )}
          <Box
            display='flex'
            flexWrap='wrap'
            alignItems='flex-start'
            justifyContent='space-around'
            flexGrow='1'
            marginTop={[8, 7]}
          >
            <Box
              display='flex'
              maxWidth={13}
              width={['100%', '100%', '40%']}
              flexDirection='column'
              alignItems='flex-start'
              alignContent='center'
              mb={4}
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
                <Header fontSize={5}>
                  A lightweight web interface to send and receive Filecoin via
                  your Ledger device
                </Header>
                <Title mt={3} color='core.darkgray'>
                  Your private and sensitive information never leave the
                  browser, and are erased upon page refresh
                </Title>
                <ImportWallet
                  onClick={() => onChoose(LEDGER)}
                  Icon={IconLedger}
                  title='Login via Ledger Device'
                  justifyContent='space-between'
                  flexDirection='column'
                  display='flex'
                  my={4}
                />
              </Box>
              <Box>
                <ExpandableBox acronym='Ta' title='Test Accounts'>
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
                </ExpandableBox>
              </Box>
            </Box>
            <Box
              position='relative'
              display='flex'
              maxWidth={13}
              width={['100%', '100%', '50%']}
              flexDirection='column'
              alignItems='flex-start'
              alignContent='center'
              backgroundColor='#0a0a0a'
              borderRadius={3}
              border={1}
              boxShadow={2}
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
                alignSelf='center'
                textAlign='left'
                p={4}
              >
                <Title fontSize={5} color='core.white'>
                  For Filecoin multisig holders
                </Title>

                <Box
                  display='flex'
                  flexDirection='column'
                  p={3}
                  my={3}
                  minHeight={10}
                  width='100%'
                  maxWidth={13}
                  alignItems='center'
                  justifyContent='flex-start'
                  borderRadius={2}
                >
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    m={3}
                  >
                    <Text
                      color='core.lightgray'
                      textAlign='center'
                      p={0}
                      mt={0}
                      maxWidth={11}
                    >
                      Use your Ledger device to manage a Filecoin multisig
                      wallet.
                    </Text>

                    <ImportWallet
                      onClick={() =>
                        navigate(router, { pageUrl: PAGE.MSIG_LANDING })
                      }
                      glyphAcronym='Ev'
                      title='Enter the Vault'
                      backgroundColor='background.screen'
                      color='core.black'
                      glyphColor='core.black'
                      boxShadow={2}
                      border={0}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}
