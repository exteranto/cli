const webpack = require('webpack')
const { basePath } = require('./helpers')

// Merge configs.
const config = {
  ...require('../assets/webpack.config'),
  ...require(basePath('exteranto.config.js')).webpackConfig
}

module.exports = class Compiler {

  /**
   * Compiles the extension.
   */
  async compile () {
    return new Promise((resolve, reject) => {
      webpack(config).run((_, stats) => {
        return stats.compilation.errors.length === 0 ? resolve() : reject({ message: '' })
      })
    })
  }

  /**
   * Watches changes and compiles.
   *
   * @param {Function} hook What to do after compiling changes
   */
  async watch (hook) {
    webpack(config).watch({}, (_, stats) => {
      if (stats.compilation.errors.length === 0) {
        return hook()
      }
    })
  }

}
