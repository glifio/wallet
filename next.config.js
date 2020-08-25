const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER
} = require('next/constants')

const envDefaults = {
  LOTUS_NODE_JSONRPC: 'https://proxy.openworklabs.com/rpc/v0'
}

module.exports = phase => {
  if (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    return {
      env: {
        ...envDefaults,
        MAGIC_STRING_ENDPOINT: 'https://glif-verifier.vercel.app/api/verify',
        IS_PROD: true
      }
    }
  }
  return {
    env: {
      ...envDefaults,
      MAGIC_STRING_ENDPOINT: 'https://glif-verifier.vercel.app/api/verify',
      IS_PROD: false
    }
  }
}
