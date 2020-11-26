const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER
} = require('next/constants')
const path = require('path')

const webpack = (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    react: path.resolve('./node_modules/react'),
    'react-dom': path.resolve('./node_modules/react-dom'),
    next: path.resolve('./node_modules/next'),
    'styled-components': path.resolve('./node_modules/styled-components')
  }

  return config;
}

module.exports = phase => {
  if (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    return {
      env: {
        // this api is configured to be load balanced across multiple nodes,
        // if a single node gets sick, it will get dropped and not accept requests
        LOTUS_NODE_JSONRPC: 'https://api.node.glif.io',
        MAGIC_STRING_ENDPOINT: 'https://glif-verifier.vercel.app/api/verify',
        IS_PROD: true
      },
      webpack
    }
  }
  return {
    env: {
      LOTUS_NODE_JSONRPC: 'https://api.node.glif.io',
      MAGIC_STRING_ENDPOINT: 'https://glif-verifier.vercel.app/api/verify',
      IS_PROD: false
    },
    webpack
  }
}
