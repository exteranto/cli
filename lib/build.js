const chalk = require('chalk')
const Packer = require('./modules/Packer')
const Compiler = require('./modules/Compiler')
const { read, progress, terminate } = require('./modules/helpers')

module.exports = async ({ env, browsers, compile }) => {

  // Quick input validation
  if (browsers.find(b => !/(chrome|safari|extensions|edge)/.test(b))) {
    console.log()
    console.log(chalk.red(`  Invalid browser [${browsers.join(',')}]`))
    console.log('  Please use one of the following: chrome, extensions, safari, edge')
    console.log()

    terminate()
  }

  // Install webpack dependencies if desired.
  if (compile) {
    await progress(
      () =>  new Compiler().compile(env),
      {
        title: `Installing Webpack for [${env}]...`,
        success: 'Webpack installed.',
        fail: 'Webpack installation failed.'
      }
    ).catch(terminate)
  }

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
