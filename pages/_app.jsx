import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import { createGlobalStyle } from 'styled-components'
import { theme, ThemeProvider } from '../components/Shared'
import withReduxStore from '../lib/with-redux-store'
import WalletProviderWrapper from '../WalletProvider'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: ${theme.fonts.sansSerif};
    font-size: 1rem;
  }
`

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        <WalletProviderWrapper network={reduxStore.getState().network}>
          <GlobalStyle />

          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </WalletProviderWrapper>
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
