import { Converter } from '@openworklabs/filecoin-number'

const converter = new Converter(
  'USD',
  'coinmarketcap',
  null,
  process.env.COINMARKETCAP_PROXY_URL || 'http://localhost:80'
)

;(async () => {
  await converter.cacheConversionRate()
})()

export { converter }
