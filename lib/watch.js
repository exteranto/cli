// webpack + cli
// vue-loader
// fewp
// stle loaders
// ts laoder
// vtc

const chalk = require('chalk')
const build = require('./build')
const Compiler = require('./modules/Compiler')

module.exports = async ({ env, browsers }) => {

  console.log(chalk.cyan('Installing webpack...'))

  // Run the compiler.
  new Compiler().watch(() => build({ env, browsers, compile: false }))

}
