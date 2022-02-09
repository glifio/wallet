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
      trailingSlash: true,
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
        // its fine for this to be public
        NEXT_PUBLIC_NODE_STATUS_API_KEY:
          process.env.NODE_STATUS_API_KEY ||
          'm786191525-b3192b91db66217a44f7d4be',
        NEXT_PUBLIC_NODE_STATUS_API_ADDRESS:
          process.env.STATUS_API_ADDRESS ||
          'https://api.uptimerobot.com/v2/getMonitors',

        // 461'
        NEXT_PUBLIC_COIN_TYPE: process.env.COIN_TYPE || 'f',
        NEXT_PUBLIC_IS_PROD: true,

        NEXT_PUBLIC_SENTRY_DSN: process.env.SENTRY_DSN,
        NEXT_PUBLIC_SENTRY_ENV: process.env.SENTRY_ENV
      }
    }
  }
  return {
    trailingSlash: true,
    webpack,
    env: {
      NEXT_PUBLIC_LOTUS_NODE_JSONRPC:
        process.env.LOTUS_NODE_JSONRPC || 'https://calibration.node.glif.io',
      NEXT_PUBLIC_GRAPH_API_URL:
        process.env.GRAPH_API_URL || 'graph.glif.host/query',
      NEXT_PUBLIC_EXPLORER_URL:
        process.env.EXPLORER_URL || 'https://calibration.explorer.glif.io',
      // its fine for this to be public
      NEXT_PUBLIC_NODE_STATUS_API_KEY:
        process.env.NODE_STATUS_API_KEY ||
        'm787669344-2a9b90eb03dbff3e503c93c7',
      NEXT_PUBLIC_NODE_STATUS_API_ADDRESS:
        process.env.STATUS_API_ADDRESS ||
        'https://api.uptimerobot.com/v2/getMonitors',
      // 1'
      NEXT_PUBLIC_COIN_TYPE: process.env.COIN_TYPE || 't'
    }
  }
}
