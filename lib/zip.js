const chalk = require('chalk')
const execa = require('execa')
const build = require('./build')
const { progress, terminate, slugify, read } = require('./modules/helpers')

module.exports = async ({ env, browsers, compile }) => {

  // Quick input validation
  if (browsers.find(b => !/(chrome|safari|extensions|edge)/.test(b))) {
    console.log()
    console.log(chalk.red(`  Invalid browser [${browsers.join(',')}]`))
    console.log('  Please use one of the following: chrome, extensions, safari, edge')
    console.log()

    terminate()
  }

  // Compile the source if desired.
  if (compile) {
    await build({ env, browsers, compile })

    console.log()
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

  // Create folder for artifacts.
  await execa('mkdir', ['-p', 'artifacts'])

  // Pack for all browsers.
  for (browser of browsers) {
    const name = await read('package.json').then(JSON.parse).then(p => p.name)
    const dir = `${name}.${browser}extension`
    const version = manifest.version

    await progress(
      async () => {
        await execa('rm', ['-f', `artifacts/${dir}-${env}-v${version}.zip`])
        if (browser === 'chrome' || browser === 'edge') {
          process.chdir(`packs`)
          await execa('zip', ['-r', '-D', `../artifacts/${dir}-${env}-v${version}.zip`, `${dir}`])
          process.chdir(`..`)
        } else {
          process.chdir(`packs/${dir}`)
          await execa('zip', ['-r', '-D', `../../artifacts/${dir}-${env}-v${version}.zip`, `./`])
          process.chdir(`../..`)
        }
      },
      {
        title: `Zipping for [${browser}][${env}][v${version}].`,
        success: `Zip for [${browser}][${env}][v${version}] created.`,
        fail: `Could not zip [${browser}][${env}][v${version}].`
      }
    ).catch(terminate)
  }

  // Summarize.
  console.log()
  console.log(chalk.bgGreen('Your extension was successfully zipped.'))
}
