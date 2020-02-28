import App from 'next/app'
import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Provider } from 'react-redux'
import { theme, ThemeProvider } from '../components/Shared'
import withReduxStore from '../lib/with-redux-store'
import WalletProviderWrapper from '../WalletProvider'
import NetworkChecker from '../lib/check-network'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-size: 1rem;
    font-family: ${theme.fonts.AliasGrotesk};
  }

  /* Alias Medium */

  @font-face {
    font-family: 'RT-Alias-Medium';
    src: url('/static/fonts/RTAliasMedium-Light.woff2');
    font-weight: 200;
  }

  @font-face {
    font-family: 'RT-Alias-Medium';
    src: url('/static/fonts/RTAliasMedium-Regular.woff2');
    font-weight: 400;
  }

  @font-face {
    font-family: 'RT-Alias-Medium';
    src: url('/static/fonts/RTAliasMedium-Bold.woff2');
    font-weight: 700;
  }

  /* Alias Grotesk */

  @font-face {
    font-family: 'RT-Alias-Grotesk';
    src: url('/static/fonts/RTAliasGrotesk-Light.woff2');
    font-weight: 200;
  }

  @font-face {
    font-family: 'RT-Alias-Grotesk';
    src: url('/static/fonts/RTAliasGrotesk-Regular.woff2');
    font-weight: 400;
  }

  @font-face {
    font-family: 'RT-Alias-Grotesk';
    src: url('/static/fonts/RTAliasGrotesk-Bold.woff2');
    font-weight: 700;
  }
`

class MyApp extends App {
  static getInitialProps({ ctx: { query, pathname } }) {
    return { query, pathname }
  }

  render() {
    const { Component, pageProps, reduxStore, query, pathname } = this.props
    return (
      <Provider store={reduxStore}>
        <GlobalStyle />
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
