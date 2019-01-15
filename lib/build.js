const chalk = require('chalk')
const execa = require('execa')
const Packer = require('./modules/Packer')
const EnvironmentHandler = require('./modules/EnvironmentHandler')
const { read, progress, terminate } = require('./modules/helpers')

module.exports = async ({ env, browsers }) => {

  // Quick input validation
  if (browsers.find(b => !/(chrome|safari|extensions)/.test(b))) {
    console.log(`Invalid browser [${browsers.join(',')}]`)

    terminate()
  }

  // Install webpack dependencies.
  await progress(
    () => execa.shell('webpack --config webpack.config.js --mode production --display=none'),
    {
      title: 'Installing Webpack...',
      success: 'Webpack installed.',
      fail: 'Webpack installation failed.'
    }
  ).catch(terminate)

  // Handle environment variables.
  await progress(
    () => new EnvironmentHandler().for(env),
    {
      title: `Handling environment variables for [${env}]...`,
      success: `[${env}] environment variables handled successfully.`,
      fail: `There was an error while handling the [${env}] environment variabes.`
    }
  ).catch(terminate)

  // Find manifest file.
  const manifest = await progress(
    () => read('manifest.json').then(JSON.parse),
    {
      title: 'Loading manifest file...',
      success: 'Manifest file found.',
      fail: 'Could not load manifest.json.'
    }
  ).catch(terminate)

  // Build for each browser.
  for (const browser of browsers) {
    await progress(
      () => new Packer().pack(browser, manifest),
      {
        title: `Packing the extension for [${browser}]...`,
        success: `[${browser}] extension packed.`,
        fail: `There was an error while packing the [${browser}] extension.`
      }
    ).catch(terminate)
  }

  // Summarize.
  console.log()
  console.log(chalk.bgGreen('Your extension was successfully built.'))
}
