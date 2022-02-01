import App from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import React from 'react'
import {
  theme,
  ThemeProvider,
  PendingMessageProvider
} from '@glif/react-components'
import {
  WalletProviderWrapper,
  BalancePoller
} from '@glif/wallet-provider-react'
import { ApolloProvider } from '@apollo/client'
import { SWRConfig } from 'swr'

import { createApolloClient } from '../apolloClient'
import ErrorBoundary from '../components/ErrorBoundary'
import JSONLD from '../JSONLD'
import '../stylesheets/normalize.css'
import '../stylesheets/styles.css'

const apolloClient = createApolloClient()

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
          <meta property='og:site_name' content='GLIF Sender' />
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
        <ApolloProvider client={apolloClient}>
          <SWRConfig value={{ refreshInterval: 10000 }}>
            <ThemeProvider theme={theme}>
              <WalletProviderWrapper
                lotusApiAddr={process.env.NEXT_PUBLIC_LOTUS_NODE_JSONRPC}
                coinType={process.env.NEXT_PUBLIC_COIN_TYPE}
              >
                <BalancePoller />
                <PendingMessageProvider>
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </PendingMessageProvider>
              </WalletProviderWrapper>
            </ThemeProvider>
          </SWRConfig>
        </ApolloProvider>
      </>
    )
  }
}

export default MyApp
