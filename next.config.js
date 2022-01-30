const path = require('path')

const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER
} = require('next/constants')

const webpack = (config) => {
  const adjustedConf = { ...config }
  const experiments = config.experiments || {}
  adjustedConf.experiments = { ...experiments, syncWebAssembly: true }

  adjustedConf.resolve.alias = {
    ...config.resolve.alias,
    react: path.resolve('./node_modules/react'),
    'react-dom': path.resolve('./node_modules/react-dom'),
    next: path.resolve('./node_modules/next'),
    'styled-components': path.resolve('./node_modules/styled-components')
  }

  return adjustedConf
}

module.exports = (phase) => {
  if (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    return {
      webpack,
      env: {
        // this api is configured to be load balanced across multiple nodes,
        // if a single node gets sick, it will get dropped and not accept requests
        LOTUS_NODE_JSONRPC:
          process.env.LOTUS_NODE_JSONRPC || 'https://mainnet.glif.host',
        GRAPH_API_URL: process.env.GRAPH_API_URL || 'graph.glif.host/query',
        EXPLORER_URL: process.env.EXPLORER_URL || 'https://explorer.glif.io',

        // 461'
        COIN_TYPE: 'f',
        FIL_SNAP_HOST: 'npm:@chainsafe/filsnap',
        IS_PROD: true
      }
    }
  }
  return {
    webpack,
    env: {
      LOTUS_NODE_JSONRPC:
        process.env.LOTUS_NODE_JSONRPC || 'https://calibration.node.glif.io',
      GRAPH_API_URL: process.env.GRAPH_API_URL || 'graph.glif.host/query',
      EXPLORER_URL:
        process.env.EXPLORER_URL || 'https://calibration.explorer.glif.io',
      // 1'
      COIN_TYPE: 't',
      FIL_SNAP_HOST: 'npm:@chainsafe/filsnap',
      IS_PROD: false
    }
  }
}
