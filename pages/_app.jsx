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
    font-size: 1rem;
    font-family: ${theme.fonts.AliasGrotesk};
  }

  /* Alias Medium */

  @font-face {
  font-family: 'RT-Alias-Medium';
  src: url('fonts/RTAliasMedium-Light.woff2');
  font-weight: 200;
 }

 @font-face {
  font-family: 'RT-Alias-Medium';
  src: url('fonts/RTAliasMedium-Regular.woff2');
  font-weight: 400;
 }
  @font-face {
  font-family: 'RT-Alias-Medium';
  src: url('fonts/RTAliasMedium-Bold.woff2');
  font-weight: 700;
 }

/* Alias Grotesk */

 @font-face {
  font-family: 'RT-Alias-Grotesk';
  src: url('fonts/RTAliasGrotesk-Light.woff2');
  font-weight: 200;
 }

 @font-face {
  font-family: 'RT-Alias-Grotesk';
  src: url('fonts/RTAliasGrotesk-Regular.woff2');
  font-weight: 400;
 }
  @font-face {
  font-family: 'RT-Alias-Grotesk';
  src: url('fonts/RTAliasGrotesk-Bold.woff2');
  font-weight: 700;
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
