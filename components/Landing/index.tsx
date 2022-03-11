import React, { useCallback, useEffect, useState } from 'react'
import {
  AppTile,
  Box,
  ButtonV2,
  IconCaution,
  LandingPageColumns,
  LandingPageContent,
  OneColumnLargeText,
  space,
  Page,
  isMobileOrTablet,
  useNetworkName,
  SmartLink
} from '@glif/react-components'
import { useRouter } from 'next/router'

import { BurnerWallet, Caution } from './Helpers'
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
    <Page phishingUrl='https://wallet.glif.io' hideAppHeader>
      <LandingPageColumns>
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
        {unsupportedDevice ? (
          <OneColumnLargeText className='primary'>
            <p>
              We&apos;re sorry, the Glif Safe only supports desktop browsers at
              the moment. Please come back on your computer!
            </p>
          </OneColumnLargeText>
        ) : (
          <LandingPageContent>
            <h2>Connect</h2>
            <Box display='flex' flexDirection='column' gridGap={space()}>
              <ButtonV2 large onClick={() => connect(PAGE.CONNECT_MM)}>
                MetaMask
              </ButtonV2>
              <ButtonV2 large onClick={() => connect(PAGE.CONNECT_LEDGER)}>
                Ledger Device
              </ButtonV2>
              <Caution>
                <IconCaution />
                <p>
                  Burner Wallets (use with caution,{' '}
                  <SmartLink href='https://blog.glif.io/burner-wallets/'>
                    read more
                  </SmartLink>
                  )
                </p>
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

            <p>
              Want to load this app directly from IPFS or Filecoin?
              <br />
              Check our{' '}
              <SmartLink href='https://github.com/glifio/wallet/releases'>
                release page
              </SmartLink>
            </p>

            <p>
              Need help?
              <br />
              Open a{' '}
              <SmartLink href='https://github.com/glifio/wallet/issues/new/choose'>
                GitHub issue
              </SmartLink>{' '}
              or hit us up on{' '}
              <SmartLink href='https://twitter.com/glifio'>Twitter</SmartLink>
            </p>
          </LandingPageContent>
        )}
      </LandingPageColumns>
    </Page>
  )
}
