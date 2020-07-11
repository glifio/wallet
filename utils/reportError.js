import axios from 'axios'
import Router from 'next/router'

export default async (id, shouldSendToErrorPage, ...args) => {
  const errorText = args.reduce(
    (err, ele) => {
      return `${err}\n${ele}`
    },
    [`WALLET:${id}\n`]
  )
  await axios.post(
    'https://errors.glif.io',
    JSON.stringify({ text: errorText })
  )
  if (shouldSendToErrorPage) Router.push('/error/wallet-down')
}
