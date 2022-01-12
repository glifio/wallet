import App from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import React from 'react'
import { theme, ThemeProvider, client } from '@glif/react-components'
import {
  WalletProviderWrapper,
  BalancePoller
} from '@glif/wallet-provider-react'
import { ApolloProvider } from '@apollo/client'
import { SWRConfig } from 'swr'

import ErrorBoundary from '../components/ErrorBoundary'
import JSONLD from '../JSONLD'
import '../stylesheets/normalize.css'
import '../stylesheets/styles.css'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>GLIF Sender</title>
          <meta name='description' content='An audited Filecoin web wallet.' />
          <meta
            name='keywords'
            content='Filecoin,Wallet,Web,Storage,Blockchain,Crypto,FIL'
          />
          <meta property='og:image' content='/bg-sender.jpg' />
          <meta property='og:title' content='GLIF Sender' />
          <meta
            property='og:description'
            content='An audited Filecoin web wallet.'
          />
          <meta property='og:url' content='https://apps.glif.io' />
          <meta name='twitter:title' content='GLIF Sender' />
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
        <ApolloProvider client={client}>
          <SWRConfig value={{ refreshInterval: 10000 }}>
            <ThemeProvider theme={theme}>
              <WalletProviderWrapper>
                <BalancePoller />
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </WalletProviderWrapper>
            </ThemeProvider>
          </SWRConfig>
        </ApolloProvider>
      </>
    )
  }
}

export default MyApp
