const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER
} = require('next/constants')

module.exports = phase => {
  if (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    return {
      env: {
        // this api is configured to be load balanced across multiple nodes,
        // if a single node gets sick, it will get dropped and not accept requests
        LOTUS_NODE_JSONRPC: 'https://node.glif.io/space02/lotus/rpc/v0',
        MAGIC_STRING_ENDPOINT: 'https://glif-verifier.vercel.app/api/verify',
        IS_PROD: true
      }
    }
  }
  return {
    env: {
      LOTUS_NODE_JSONRPC: 'https://node.glif.io/space04/lotus/rpc/v0',
      MAGIC_STRING_ENDPOINT: 'https://glif-verifier.vercel.app/api/verify',
      IS_PROD: false
    }
  }
}
