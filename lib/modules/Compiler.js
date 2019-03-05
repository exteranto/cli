const dotenv = require('dotenv')
const webpack = require('webpack')
const { basePath } = require('./helpers')

module.exports = class Compiler {

  /**
   * Compiles the extension.
   *
   * @param {string} env The desired environment
   */
  async compile (env) {
    return new Promise((resolve, reject) => {
      webpack(this._buildConfig(env)).run((_, stats) => {
        return stats.compilation.errors.length === 0 ? resolve() : reject({ message: '' })
      })
    })
  }

  /**
   * Watches changes and compiles.
   *
   * @param {Function} hook What to do after compiling changes
   * @param {string} env The desired environment
   */
  async watch (hook, env) {
    webpack(this._buildConfig(env)).watch({}, (_, stats) => {
      if (stats.compilation.errors.length === 0) {
        return hook()
      }
    })
  }

  /**
   * Builds a webpack config from the template and from the user overrides.
   *
   * @param {string} env The desired environment
   * @return {any} The resulting config
   */
  _buildConfig (env) {
    dotenv.config({ path: `.env.${env}` })

    const variables = Object.keys(process.env)
      .filter(key => /^EXT/.test(key))
      .reduce((carry, item) => ({
        ...carry,
        [item.replace(/^EXT_/, '')]: JSON.stringify(process.env[item])
      }), {})

    // Merge configs.
    return {
      ...require('../assets/webpack.config')(variables),
      ...require(basePath('exteranto.config.js')).webpackConfig
    }
  }

}
