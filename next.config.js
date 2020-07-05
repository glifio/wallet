const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const envDefaults = {
  LOTUS_NODE_JSONRPC: 'http://127.0.0.1:1234/rpc/v0'
}

module.exports = phase => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        ...envDefaults,
        IS_DEV: true
      }
    }
  }

  return {
    env: {
      ...envDefaults,
      IS_DEV: false
    }
  }
}
