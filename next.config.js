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
        NEXT_PUBLIC_LOTUS_NODE_JSONRPC:
          process.env.LOTUS_NODE_JSONRPC || 'https://mainnet.glif.host',
        NEXT_PUBLIC_GRAPH_API_URL:
          process.env.GRAPH_API_URL || 'graph.glif.host/query',
        NEXT_PUBLIC_EXPLORER_URL:
          process.env.EXPLORER_URL || 'https://explorer.glif.io',

        // 461'
        NEXT_PUBLIC_COIN_TYPE: process.env.COIN_TYPE || 'f',
        NEXT_PUBLIC_IS_PROD: true,

        NEXT_PUBLIC_SENTRY_DSN:
          process.env.SENTRY_DSN ||
          'https://1936108dd14b4c93b10849eb3c2f98f4@o1126745.ingest.sentry.io/6168017',
        NEXT_PUBLIC_SENTRY_ENV: process.env.SENTRY_ENV || 'test-env'
      }
    }
  }
  return {
    webpack,
    env: {
      NEXT_PUBLIC_LOTUS_NODE_JSONRPC:
        process.env.LOTUS_NODE_JSONRPC || 'https://calibration.node.glif.io',
      NEXT_PUBLIC_GRAPH_API_URL:
        process.env.GRAPH_API_URL || 'graph.glif.host/query',
      NEXT_PUBLIC_EXPLORER_URL:
        process.env.EXPLORER_URL || 'https://calibration.explorer.glif.io',
      // 1'
      NEXT_PUBLIC_COIN_TYPE: process.env.COIN_TYPE || 't'
    }
  }
}
