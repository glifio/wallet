import axios from 'axios'

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
}
