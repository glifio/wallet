import React, { useCallback, useMemo, useState } from 'react'
import {
  AppTile,
  Box,
  IconCaution,
  Footer,
  PhishingBanner,
  LandingPageContainer,
  LandingPageContentContainer,
  space,
  fontSize,
  H2,
  P,
  isMobileOrTablet,
  theme
} from '@glif/react-components'
import { useRouter } from 'next/router'

import {
  ResponsiveWalletTile,
  ConnectContentContainer,
  ConnectBtn,
  BurnerWallet,
  TextBox,
  Caution
} from './Helpers'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

export default function Landing() {
  const isUnsupportedDevice = useMemo(() => isMobileOrTablet(), [])
  const [closed, setClosed] = useState(false)
  const router = useRouter()

  const connect = useCallback(
    (pageUrl: PAGE) => {
      navigate(router, { pageUrl })
    },
    [router]
  )

  return (
    <>
      <LandingPageContainer>
        <LandingPageContentContainer phishingBannerClosed={closed}>
          <PhishingBanner
            href='https://wallet.glif.io'
            closed={closed}
            setClosed={() => setClosed(true)}
          />
          <ResponsiveWalletTile phishingBannerClosed={closed}>
            <AppTile
              title='Sender'
              oldTileName='Wallet'
              description='A lightweight interface for sending Filecoin.'
              imgSrc='/bg-sender.jpg'
              imgSrcHover='/bg-sender-hover.jpg'
              small={false}
              large
            />
          </ResponsiveWalletTile>
          <ConnectContentContainer
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isUnsupportedDevice ? (
              <TextBox style={{ background: theme.colors.core.primary }}>
                <P
                  css={`
                    font-size: ${fontSize('large')};
                    color: white;
                  `}
                >
                  We&apos;re sorry, the Glif Sender only supports desktop
                  browsers at the moment. Please come back on your computer!
                </P>
              </TextBox>
            ) : (
              <Box>
                <H2
                  style={{
                    marginTop: 0,
                    marginBottom: '1em',
                    fontWeight: 'normal',
                    fontSize: fontSize('large'),
                    lineHeight: '1.3em'
                  }}
                >
                  Connect
                </H2>

                <Box
                  display='flex'
                  flexDirection='column'
                  width='100%'
                  css={`
                    &:not(:first-child) {
                      margin-top: ${space()};
                    }
                  `}
                >
                  <ConnectBtn large onClick={() => connect(PAGE.CONNECT_MM)}>
                    MetaMask
                  </ConnectBtn>
                  {/* <ConnectBtn large>Brave</ConnectBtn> */}
                  <ConnectBtn
                    large
                    onClick={() => connect(PAGE.CONNECT_LEDGER)}
                  >
                    Ledger Device
                  </ConnectBtn>
                  {/* <ConnectBtn large>Glif CLI</ConnectBtn> */}
                  <Caution>
                    <IconCaution />
                    <P>
                      Burner Wallets (use with caution, <a>read more</a>)
                    </P>
                  </Caution>
                  <BurnerWallet
                    large
                    onClick={() => connect(PAGE.CONNECT_BURNER_CREATE_SEED)}
                  >
                    Create Seed Phrase
                  </BurnerWallet>
                  <BurnerWallet
                    large
                    onClick={() => connect(PAGE.CONNECT_BURNER_IMPORT_SEED)}
                  >
                    Import Seed Phrase
                  </BurnerWallet>
                  <BurnerWallet
                    large
                    onClick={() => connect(PAGE.CONNECT_BURNER_IMPORT_PK)}
                  >
                    Import Private Key
                  </BurnerWallet>
                </Box>
                <Box mt={6}>
                  <P
                    css={`
                      font-size: ${fontSize('default')};
                    `}
                  >
                    Want to load this app directly from IPFS/FIL?
                    <br />
                    Check our <a href='#'>release page</a>
                  </P>

                  <P
                    css={`
                      font-size: ${fontSize('default')};
                    `}
                  >
                    Need help?
                    <br />
                    <a href='#'>Reach out</a> to us
                  </P>
                </Box>
              </Box>
            )}
          </ConnectContentContainer>
        </LandingPageContentContainer>
      </LandingPageContainer>
      <Box p={`0 ${space()} ${space()}`}>
        <Footer />
      </Box>
    </>
  )
}
