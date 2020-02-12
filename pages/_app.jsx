import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import { theme, ThemeProvider } from '@openworklabs/filecoin-wallet-styleguide'
import withReduxStore from '../lib/with-redux-store'

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
