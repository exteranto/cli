const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const execa = require('execa')
const rimraf = require('rimraf')

module.exports = async (name) => {

  // Try to clone the skeleton project.
  console.log()
  const git = ora(chalk.cyan('Pulling Exteranto skeleton github repository...')).start()

  if (await exists(name)) {
    git.fail([chalk.bgRed(`The directory [${name}] already exists.`)])

    return
  }

  await execa('git', ['clone', 'git@github.com:exteranto/exteranto.git', name])
  git.succeed(['Exteranto skeleton pulled.'])

  // Install npm dependencies.
  const npm = ora(chalk.cyan('Installing dependencies, this might take a while...')).start()
  await execa.shell(`cd ${name} && npm i`)
  npm.succeed(['Dependencies installed.'])

  const cleanup = ora(chalk.cyan('Cleaning up...')).start()
  await remove(`${name}/.git`)
  await execa.shell(`cd ${name} && git init`)
  cleanup.succeed(['Created a new git instance.'])

  // Summarize.
  console.log()
  await console.log(chalk.bgGreen(`Your project is boilerplate is ready!`))
}

const remove = path => new Promise(resolve => rimraf(path, [], resolve))
const exists = path => new Promise(resolve => fs.exists(path, resolve))
