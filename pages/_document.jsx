import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import JSONLD from '../JSONLD'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })
      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            type='application/ld+json'
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script async defer src='https://cdn.simpleanalytics.io/hello.js' />
          <noscript>
            <img src='https://api.simpleanalytics.io/hello.gif' alt='' />
          </noscript>
        </body>
      </Html>
    )
  }
}
