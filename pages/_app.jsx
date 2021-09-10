import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider } from 'react-redux'
import { theme, ThemeProvider } from '../components/Shared'
import withReduxStore from '../lib/with-redux-store'
import WalletProviderWrapper from '../WalletProvider'
import { NetworkChecker } from '../lib/check-network'
import BalancePoller from '../lib/update-balance'
import { WasmLoader } from '../lib/WasmLoader'
import ErrorBoundary from '../lib/ErrorBoundary'
import '../stylesheets/normalize.css'
import '../stylesheets/styles.css'

class MyApp extends App {
  static getInitialProps({ ctx: { query, pathname } }) {
    return { query, pathname }
  }

  render() {
    const { Component, pageProps, reduxStore, query, pathname } = this.props
    return (
      <>
        <Head>
          <title>Glif</title>
        </Head>
        <Provider store={reduxStore}>
          <ThemeProvider theme={theme}>
            <WasmLoader>
              <NetworkChecker pathname={pathname} query={query} />
              <WalletProviderWrapper network={reduxStore.getState().network}>
                <BalancePoller />
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </WalletProviderWrapper>
            </WasmLoader>
          </ThemeProvider>
        </Provider>
      </>
    )
  }
}

export default withReduxStore(MyApp)
