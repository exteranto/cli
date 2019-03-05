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
  .command('build')
  .usage('[options]')
  .option(
    '-e, --env, --environment [env]',
    'specify the environment',
    /([a-z]+)/,
    'prod'
  )
  .option(
    '-b, --browsers [browsers]',
    'specify the browsers',
    val => val.toLowerCase().split(/[^a-z]+/),
    ['chrome', 'safari', 'extensions']
  )
  .option(
    '-n, --no-compile',
    'whether to skip compilation'
  )
  .description('Build your Exteranto project for a specified browser and environment.')
  .action(require('../lib/build.js'))

program
  .command('watch')
  .usage('[options]')
  .option(
    '-e, --env, --environment [env]',
    'specify the environment',
    /(prod|stage|dev)/,
    'prod'
  )
  .option(
    '-b, --browsers [browsers]',
    'specify the browsers',
    val => val.toLowerCase().split(/[^a-z]+/),
    ['chrome', 'safari', 'extensions']
  )
  .description('Watch changes for your Exteranto project for a specified browser and environment.')
  .action(require('../lib/watch.js'))

program
  .arguments('<command>')
  .action((cmd) => {
    console.log(chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  })

program.parse(process.argv)
