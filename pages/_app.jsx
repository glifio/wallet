import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider } from 'react-redux'
import { theme, ThemeProvider } from '../components/Shared'
import withReduxStore from '../lib/with-redux-store'
import WalletProviderWrapper from '../WalletProvider'
import NetworkChecker from '../lib/check-network'
import BalancePoller from '../lib/update-balance'
import { ConverterWrapper } from '../lib/Converter'
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
          <WasmLoader>
            <ConverterWrapper>
              <WalletProviderWrapper network={reduxStore.getState().network}>
                <NetworkChecker pathname={pathname} query={query} />
                <BalancePoller />
                <ThemeProvider theme={theme}>
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </ThemeProvider>
              </WalletProviderWrapper>
            </ConverterWrapper>
          </WasmLoader>
        </Provider>
      </>
    )
  }
}

export default withReduxStore(MyApp)
