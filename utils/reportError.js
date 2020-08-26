import axios from 'axios'
import Router from 'next/router'

// This simply formats error messages and sends them to our slack channel
export default async (id, shouldSendToErrorPage) => {
  if (process.env.IS_PROD) {
    await axios.post(
      'https://errors.glif.io',
      JSON.stringify({ text: `WALLET:${id}` })
    )
  }
  if (shouldSendToErrorPage) Router.push('/error/wallet-down')
}
