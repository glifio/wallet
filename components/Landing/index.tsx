import React, { useMemo } from 'react'
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

import {
  ResponsiveWalletTile,
  ConnectContentContainer,
  ConnectBtn,
  BurnerWallet,
  TextBox,
  Caution
} from './Helpers'

export default function Landing() {
  const isUnsupportedDevice = useMemo(() => isMobileOrTablet(), [])
  return (
    <>
      <LandingPageContainer css={'background: white'}>
        <PhishingBanner href='https://wallet.glif.io' />
        <LandingPageContentContainer>
          <ResponsiveWalletTile>
            <AppTile
              title='Wallet'
              description='A lightweight interface for sending Filecoin.'
              imgSrc='/bg-wallet.png'
              large
            />
          </ResponsiveWalletTile>
          <ConnectContentContainer>
            {isUnsupportedDevice ? (
              <TextBox style={{ background: theme.colors.core.primary }}>
                <P
                  css={`
                    font-size: ${fontSize('large')};
                    color: white;
                  `}
                >
                  We&apos;re sorry, the Glif Wallet only supports desktop
                  browsers at the moment. Please come back on your computer!
                </P>
              </TextBox>
            ) : (
              <>
                <H2
                  style={{
                    marginBottom: '1em',
                    fontSize: fontSize('large'),
                    lineHeight: '1.3em'
                  }}
                >
                  Connect
                </H2>
                {/**
                 * This <Box display='flex'...etc> is equivalent to
                 * <div style={{ display: 'flex', ....etc }} /> OR
                 * <div css={`
                 *    display: flex;
                 *    ...other styles...
                 * `}
                 */}
                <Box display='flex' flexDirection='column' height='100%'>
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
                    <ConnectBtn large>MetaMask</ConnectBtn>
                    <ConnectBtn large>Brave</ConnectBtn>
                    <ConnectBtn large>Ledger Device</ConnectBtn>
                    <ConnectBtn large>Glif CLI</ConnectBtn>
                    <Caution>
                      <IconCaution />
                      <P>
                        Burner Wallets (use with caution, <a>read more</a>)
                      </P>
                    </Caution>
                    <BurnerWallet large>Generate Seed Phrase</BurnerWallet>
                    <BurnerWallet large>Import Seed Phrase</BurnerWallet>
                    <BurnerWallet large>Import Private Key</BurnerWallet>
                  </Box>
                  {/**
                   * This <Box mt={6}> is equivalent to
                   * <div style={{ marginTop: theme.spaces[6] }} /> OR
                   * <div css={` margin-top: ${theme.spaces[6]} `}
                   */}
                  <Box mt={6}>
                    <P
                      css={`
                        font-size: ${fontSize('default')};
                      `}
                    >
                      What is this and why is it important?
                      <br />
                      Read the <a href='#'>Glif Verifier walkthrough</a> on the
                      blog.
                    </P>

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
              </>
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
