const { TextDecoder, TextEncoder } = require('util')

global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

import '@testing-library/jest-dom'
import 'jest-styled-components'
import 'whatwg-fetch'

process.env.LOTUS_NODE_JSONRPC = 'https://calibration.node.glif.io/rpc/v0'
process.env.COIN_TYPE = 't'
