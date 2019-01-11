const fs = require('fs')
const dotenv = require('dotenv')
const { read, write } = require('./helpers')

module.exports = class EnvironmentHandler {

  /**
   * Build the application for a specified environment.
   *
   * @param {string} env
   */
  async for (env) {
    dotenv.config({ path: `.env.${env}` })

    const variables = Object.keys(process.env)
      .filter(key => /^EXT/.test(key))
      .reduce((carry, item) => ({
        ...carry,
        [item.replace(/^EXT_/, '')]: process.env[item]
      }), {})

    const files = await new Promise((resolve, reject) => {
      fs.readdir('dist', (err, data) => err ? reject(err) : resolve(data))
    })

    for (const file of files) {
      let code = await read(`dist/${file}`)

      // Prepend the environment variables.
      code = `const env=${JSON.stringify(variables)};${code}`

      await write(`dist/${file}`, code)
    }
  }
}
