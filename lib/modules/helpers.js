const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const rimraf = require('rimraf')

module.exports = {
  /**
   * Remove recursively anything at the specified path.
   *
   * @param {string} path
   * @return {Promise<any>}
   */
  remove: path => new Promise(resolve => rimraf(path, [], resolve)),

  /**
   * Check whether the specified path exists.
   *
   * @param {string} path
   * @return {Promise<boolean>}
   */
  exists: path => new Promise(resolve => fs.exists(path, resolve)),

  /**
   * Read a file at the specified path.
   *
   * @param {string} path
   * @return {Promise<string>}
   */
  read: path => new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      err ? reject(err) : resolve(Buffer.from(data).toString('UTF-8'))
    })
  }),

  /**
   * Read a file at the specified path.
   *
   * @param {string} path
   * @return {Promise<string>}
   */
  write: (path, content) => new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => err ? reject(err) : resolve())
  }),

  /**
   * Progress spinner helper.
   *
   * @param {() => any} action
   * @param {any} messages
   * @return {Promise<any>}
   */
  progress: async (action, messages) => {
    const spinner = ora(chalk.cyan(messages.title)).start()

    return action()
      .then((result) => {
        spinner.succeed([messages.success])

        return result
      })
      .catch((e) => {
        spinner.fail([chalk.bgRed(messages.fail)])
        console.log()
        console.log(e.message)

        throw e
      })

  },

  /**
   * Progress spinner helper.
   *
   * @param {() => any} action
   * @param {any} messages
   * @return {Promise<any>}
   */
  terminate: () => process.exit(1),

  /**
   * Slugify a string.
   *
   * @param {string} val
   * @param {any} messages
   */
  slugify: val => val.toLowerCase().replace(/\s/g, '-').replace(/[^\w-_]/g, '')
}
