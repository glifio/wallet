import '@glif/base-css'
import App from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import {
  PendingMessageProvider,
  WalletProviderWrapper,
  BalancePoller,
  EnvironmentProvider,
  ApolloWrapper,
  ErrorBoundary
} from '@glif/react-components'
import { SWRConfig } from 'swr'
import { WalletPage } from '../components/WalletPage'
import JSONLD from '../JSONLD'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>GLIF Wallet</title>
          <meta name='description' content='An audited Filecoin web wallet.' />
          <meta
            name='keywords'
            content='Filecoin,Wallet,Web,Storage,Blockchain,Crypto,FIL'
          />
          <meta property='og:image' content='/bg-sender.jpg' />
          <meta property='og:title' content='GLIF Wallet' />
          <meta
            property='og:description'
            content='An audited Filecoin web wallet.'
          />
          <meta property='og:url' content='https://beta.wallet.glif.io' />
          <meta name='twitter:title' content='GLIF Wallet' />
          <meta
            name='twitter:description'
            content='An audited Filecoin web wallet.'
          />
          <meta name='twitter:image' content='/bg-sender.jpg' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:creator' content='@glifio' key='twhandle' />
          <meta property='og:site_name' content='GLIF Wallet' />
          <meta
            name='twitter:image:alt'
            content='An audited Filecoin web wallet.'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/static/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/static/favicon-32x32.png'
          />
        </Head>
        <Script
          id='json-ld'
          type='application/ld+json'
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
        />
        <EnvironmentProvider
          homeUrl={process.env.NEXT_PUBLIC_HOME_URL}
          blogUrl={process.env.NEXT_PUBLIC_BLOG_URL}
          walletUrl={process.env.NEXT_PUBLIC_WALLET_URL}
          safeUrl={process.env.NEXT_PUBLIC_SAFE_URL}
          explorerUrl={process.env.NEXT_PUBLIC_EXPLORER_URL}
          verifierUrl={process.env.NEXT_PUBLIC_VERIFIER_URL}
          nodeStatusApiUrl='https://api.uptimerobot.com/v2/getMonitors'
          isProd={false}
          sentryDsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
          sentryEnv={process.env.NEXT_PUBLIC_SENTRY_ENV}
        >
          <ApolloWrapper>
            <SWRConfig value={{ refreshInterval: 10000 }}>
              <WalletProviderWrapper>
                <BalancePoller />
                <PendingMessageProvider>
                  <ErrorBoundary Wrapper={WalletPage}>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </PendingMessageProvider>
              </WalletProviderWrapper>
            </SWRConfig>
          </ApolloWrapper>
        </EnvironmentProvider>
      </>
    )
  }
}

export default MyApp
