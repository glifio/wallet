import React, { useCallback, useEffect, useState } from 'react'
import {
  AppHeader,
  AppTile,
  Box,
  IconCaution,
  Footer,
  PhishingBanner,
  LandingPageOuter,
  LandingPageInner,
  LandingPageAppTile,
  LandingPageContent,
  space,
  fontSize,
  P,
  isMobileOrTablet,
  theme,
  useNetworkName,
  SmartLink
} from '@glif/react-components'
import { useRouter } from 'next/router'

import { ConnectBtn, BurnerWallet, TextBox, Caution } from './Helpers'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

export default function Landing() {
  const [unsupportedDevice, setUnsupportedDevice] = useState(false)
  useEffect(() => {
    if (isMobileOrTablet()) setUnsupportedDevice(true)
  }, [])
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
      <LandingPageOuter>
        <PhishingBanner href='https://wallet.glif.io' />
        <AppHeader
          homeUrl={process.env.NEXT_PUBLIC_HOME_URL}
          blogUrl={process.env.NEXT_PUBLIC_BLOG_URL}
          walletUrl={process.env.NEXT_PUBLIC_WALLET_URL}
          safeUrl={process.env.NEXT_PUBLIC_SAFE_URL}
        />
        <LandingPageInner>
          <LandingPageAppTile>
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
          </LandingPageAppTile>
          <LandingPageContent>
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
              <>
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

                <Box mt={6} fontSize='1.125rem'>
                  <P>
                    Want to load this app directly from IPFS or Filecoin?
                    <br />
                    Check our{' '}
                    <SmartLink href='https://github.com/glifio/wallet/releases'>
                      release page
                    </SmartLink>
                  </P>
                  <P>
                    Need help?
                    <br />
                    Open a{' '}
                    <SmartLink href='https://github.com/glifio/wallet/issues/new/choose'>
                      GitHub issue
                    </SmartLink>
                    {' '}or hit us up on{' '}
                    <SmartLink href='https://twitter.com/glifio'>
                      Twitter
                    </SmartLink>
                  </P>
                </Box>
              </>
            )}
          </LandingPageContent>
        </LandingPageInner>
      </LandingPageOuter>
      <Footer />
    </>
  )
}
