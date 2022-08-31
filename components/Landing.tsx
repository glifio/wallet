import { useEffect, useState } from 'react'
import {
  AppTile,
  ButtonV2Link,
  FullWidthButtons,
  WarningBox,
  LandingPageColumns,
  LandingPageContent,
  OneColumnLargeText,
  Page,
  isMobileOrTablet,
  SmartLink,
  useEnvironment,
  Network
} from '@glif/react-components'

import { GLIF_DISCORD, GLIF_TWITTER, PAGE } from '../constants'

export default function Landing() {
  const [unsupportedDevice, setUnsupportedDevice] = useState(false)
  useEffect(() => {
    if (isMobileOrTablet()) setUnsupportedDevice(true)
  }, [])
  const { networkName } = useEnvironment()
  return (
    <Page phishingUrl='https://wallet.glif.io' hideAppHeader>
      <LandingPageColumns>
        <AppTile
          title={
            networkName && networkName !== Network.MAINNET
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
              We&apos;re sorry, the Glif Wallet only supports desktop browsers
              at the moment. Please come back on your computer!
            </p>
          </OneColumnLargeText>
        ) : (
          <LandingPageContent>
            <h2>Connect</h2>

            <FullWidthButtons>
              <ButtonV2Link large href={PAGE.CONNECT_MM}>
                MetaMask
              </ButtonV2Link>
              <ButtonV2Link large href={PAGE.CONNECT_LEDGER}>
                Ledger Device
              </ButtonV2Link>
            </FullWidthButtons>

            <FullWidthButtons>
              <WarningBox>
                Burner Wallets (use with caution,{' '}
                <SmartLink href='https://blog.glif.io/burner-wallets/'>
                  read more
                </SmartLink>
                )
              </WarningBox>
              <ButtonV2Link gray large href={PAGE.CONNECT_BURNER_CREATE_SEED}>
                Create Seed Phrase
              </ButtonV2Link>
              <ButtonV2Link gray large href={PAGE.CONNECT_BURNER_IMPORT_SEED}>
                Import Seed Phrase
              </ButtonV2Link>
              <ButtonV2Link gray large href={PAGE.CONNECT_BURNER_IMPORT_PK}>
                Import Private Key
              </ButtonV2Link>
            </FullWidthButtons>

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
              </SmartLink>
              , join our <SmartLink href={GLIF_DISCORD}>Discord</SmartLink>, or
              or hit us up on <SmartLink href={GLIF_TWITTER}>Twitter</SmartLink>{' '}
            </p>
          </LandingPageContent>
        )}
      </LandingPageColumns>
    </Page>
  )
}
