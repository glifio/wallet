import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider } from 'react-redux'
import { theme, ThemeProvider } from '../components/Shared'
import withReduxStore from '../lib/with-redux-store'
import WalletProviderWrapper from '../WalletProvider'
import { MsigProviderWrapper } from '../MsigProvider'
import BalancePoller from '../lib/update-balance'
import { WasmLoader } from '../lib/WasmLoader'
import ErrorBoundary from '../lib/ErrorBoundary'
import '../stylesheets/normalize.css'
import '../stylesheets/styles.css'
import { SWRConfig } from 'swr'

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <>
        <Head>
          <title>Glif</title>
        </Head>
        <SWRConfig value={{ refreshInterval: 10000 }}>
          <Provider store={reduxStore}>
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
          </Provider>
        </SWRConfig>
      </>
    )
  }
}

export default withReduxStore(MyApp)
