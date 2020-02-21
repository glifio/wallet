const path = require('path')

module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      /* eslint-disable no-param-reassign */
      config.resolve.alias['styled-components'] = path.resolve(
        './node_modules/styled-components'
      )
    }
    return config
  }
}
