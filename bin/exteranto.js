#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')

program
  .version(require('../package').version, '-v, --version')
  .usage('<command> [options]')

program
  .command('create <name>')
  .description('Create a new project powered by Exteranto.')
  .action(require('../lib/create.js'))

program
  .arguments('<command>')
  .action((cmd) => {
    console.log(chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  })

program.parse(process.argv)
