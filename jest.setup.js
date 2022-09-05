const { TextDecoder, TextEncoder } = require('util')

global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

import '@testing-library/jest-dom'
import 'jest-styled-components'
import 'whatwg-fetch'
