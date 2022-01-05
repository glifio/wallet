import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { theme, ThemeProvider } from '@glif/react-components'
import {
  WalletProviderWrapper,
  BalancePoller
} from '@glif/wallet-provider-react'
import { SWRConfig } from 'swr'
import { MsigProviderWrapper } from '../MsigProvider'
import { WasmLoader } from '../lib/WasmLoader'
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
        <SWRConfig value={{ refreshInterval: 10000 }}>
          <ThemeProvider theme={theme}>
            <WasmLoader>
              <WalletProviderWrapper>
                <MsigProviderWrapper>
                  <BalancePoller />
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </MsigProviderWrapper>
              </WalletProviderWrapper>
            </WasmLoader>
          </ThemeProvider>
        </SWRConfig>
      </>
    )
  }
}

export default MyApp
