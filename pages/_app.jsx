import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { theme, ThemeProvider, client } from '@glif/react-components'
import {
  WalletProviderWrapper,
  BalancePoller
} from '@glif/wallet-provider-react'
import { ApolloProvider } from '@apollo/client'
import { SWRConfig } from 'swr'
import ErrorBoundary from '../lib/ErrorBoundary'
import '../stylesheets/normalize.css'
import '../stylesheets/styles.css'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Glif</title>
        </Head>
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
