const { TextDecoder } = require('util')
// @ts-ignore
global.TextDecoder = TextDecoder

import '@testing-library/jest-dom'
import 'jest-styled-components'

process.env.LOTUS_NODE_JSONRPC = 'https://calibration.node.glif.io/rpc/v0'
process.env.COIN_TYPE = 't'
