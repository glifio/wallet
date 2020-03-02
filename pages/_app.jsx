import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import { theme, ThemeProvider } from '../components/Shared'
import withReduxStore from '../lib/with-redux-store'
import WalletProviderWrapper from '../WalletProvider'
import NetworkChecker from '../lib/check-network'
import '../styles.css'

class MyApp extends App {
  static getInitialProps({ ctx: { query, pathname } }) {
    return { query, pathname }
  }

  render() {
    const { Component, pageProps, reduxStore, query, pathname } = this.props
    return (
      <Provider store={reduxStore}>
        <WalletProviderWrapper network={reduxStore.getState().network}>
          <NetworkChecker pathname={pathname} query={query} />
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </WalletProviderWrapper>
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
