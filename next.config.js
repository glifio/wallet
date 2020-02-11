module.exports = {
  webpack(config) {
    /* eslint-disable no-param-reassign */
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    return config
  }
}
