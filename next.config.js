const { PHASE_PRODUCTION_SERVER } = require('next/constants')

const envDefaults = {
  LOTUS_NODE_JSONRPC: 'https://proxy.openworklabs.com/rpc/v0'
}

module.exports = phase => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {
      env: {
        ...envDefaults,
        IS_PROD: true
      }
    }
  }
  return {
    env: {
      ...envDefaults,
      IS_PROD: false
    }
  }
}
