import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import { theme, ThemeProvider } from '@openworklabs/filecoin-wallet-styleguide'
import withReduxStore from '../lib/with-redux-store'
import WalletProviderWrapper from '../WalletProvider'

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        <WalletProviderWrapper network={reduxStore.getState().network}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </WalletProviderWrapper>
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
