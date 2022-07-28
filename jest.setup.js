const { TextDecoder, TextEncoder } = require('util')

global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

import '@testing-library/jest-dom'
import 'jest-styled-components'
import 'whatwg-fetch'

process.env.NEXT_PUBLIC_HOME_URL = 'https://glif.io'
process.env.NEXT_PUBLIC_BLOG_URL = 'https://blog.glif.io/'
process.env.NEXT_PUBLIC_WALLET_URL = 'https://wallet-calibration.glif.link'
process.env.NEXT_PUBLIC_SAFE_URL = 'https://safe-calibration.glif.link'
process.env.NEXT_PUBLIC_EXPLORER_URL = 'https://explorer-calibration.glif.link'
process.env.NEXT_PUBLIC_VERIFIER_URL = 'https://verify-calibration.glif.link'
process.env.NEXT_PUBLIC_LOTUS_NODE_JSONRPC =
  'https://api.calibration.node.glif.io//rpc/v0'
process.env.NEXT_PUBLIC_COIN_TYPE = 't'
