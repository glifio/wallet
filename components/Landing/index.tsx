import React, { useCallback, useEffect, useState } from 'react'
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
  P,
  isMobileOrTablet,
  theme,
  useNetworkName
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
  const [unsupportedDevice, setUnsupportedDevice] = useState(false)
  useEffect(() => {
    if (isMobileOrTablet()) setUnsupportedDevice(true)
  }, [])
  const [closed, setClosed] = useState(false)
  const router = useRouter()

  const { networkName } = useNetworkName(
    process.env.NEXT_PUBLIC_LOTUS_NODE_JSONRPC
  )
  const connect = useCallback(
    (pageUrl: PAGE) => {
      navigate(router, { pageUrl })
    },
    [router]
  )

  return (
    <>
      <LandingPageContainer>
        <PhishingBanner
          href='https://wallet.glif.io'
          closed={closed}
          setClosed={() => setClosed(true)}
        />
        <LandingPageContentContainer>
          <ResponsiveWalletTile phishingBannerClosed={closed}>
            <AppTile
              title={
                networkName && networkName !== 'Mainnet'
                  ? `Wallet (${networkName})`
                  : 'Wallet'
              }
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
            {unsupportedDevice ? (
              <TextBox style={{ background: theme.colors.core.primary }}>
                <P
                  css={`
                    font-size: ${fontSize('large')};
                    color: white;
                  `}
                >
                  We&apos;re sorry, the Glif Safe only supports desktop browsers
                  at the moment. Please come back on your computer!
                </P>
              </TextBox>
            ) : (
              <Box>
                <h2>Connect</h2>
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
                  <ConnectBtn
                    large
                    onClick={() => connect(PAGE.CONNECT_LEDGER)}
                  >
                    Ledger Device
                  </ConnectBtn>
                  <Caution>
                    <IconCaution />
                    <P>
                      Burner Wallets (use with caution,{' '}
                      <a
                        href='https://blog.glif.io/burner-wallets/'
                        target='_blank'
                        rel='nooppener noreferrer'
                      >
                        read more
                      </a>
                      )
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
                    Want to load this app directly from IPFS or Filecoin?
                    <br />
                    Check our{' '}
                    <a
                      href='https://github.com/glifio/wallet/releases'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      release page
                    </a>
                  </P>

                  <P
                    css={`
                      font-size: ${fontSize('default')};
                    `}
                  >
                    Need help?
                    <br />
                    Open a{' '}
                    <a
                      href='https://github.com/glifio/wallet/issues/new/choose'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      GitHub issue
                    </a>{' '}
                    or hit us up on{' '}
                    <a
                      href='https://twitter.com/glifio'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Twitter
                    </a>
                  </P>
                </Box>
              </Box>
            )}
          </ConnectContentContainer>
        </LandingPageContentContainer>
      </LandingPageContainer>
      <Footer />
    </>
  )
}
