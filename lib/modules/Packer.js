const dot = require('dot')
const execa = require('execa')
const { read, remove, slugify, write } = require('./helpers')

module.exports = class Packer {

  /**
   * Pack the extension for the specified browser.
   *
   * @param {string} browser
   * @param {object} manifest
   */
  async pack (browser, manifest) {
    const dir = `packs/${slugify(manifest.name)}.${browser}extension`
    const template = await read(`node_modules/@exteranto/cli/lib/templates/manifests/${browser}.stub`)

    // Create the pack folder, if not exists.
    await execa.command('mkdir -p packs')

    // Remove any previous packs.
    await remove(dir)

    // Create the folder again.
    await execa.command(`mkdir -p ${dir}`)

    // Copy crucial contents.
    await execa.command(`[[ -d static ]] && cp -R dist static ${dir}`)
    await execa.command(`[[ -d _locales ]] && cp -R dist _locales ${dir}`)

    // Finish up with browser specific actions.
    return this[browser](manifest, dir, template)
  }

  /**
   * Finish up packing for chrome.
   *
   * @param {object} manifest
   * @param {string} dir
   * @param {string} template
   */
  async chrome (manifest, dir, template) {
    return write(
      `${dir}/manifest.json`,
      dot.template(template)(manifest).replace(/"/g, '\"'),
    )
  }

  /**
   * Finish up packing for extensions.
   *
   * @param {object} manifest
   * @param {string} dir
   * @param {string} template
   */
  async extensions (manifest, dir, template) {
    return this.chrome(manifest, dir, template)
  }

  /**
   * Finish up packing for safari.
   *
   * @param {object} manifest
   * @param {string} dir
   * @param {string} template
   */
  async safari (manifest, dir, template) {
    const globalPage = await read(`node_modules/@exteranto/cli/lib/templates/manifests/global.html.stub`)

    await write(
      `${dir}/Info.plist`,
      dot.template(template)(manifest).replace(/"/g, '\"')
    )

    return write(
      `${dir}/global.html`,
      dot.template(globalPage)(manifest).replace(/"/g, '\"')
    )
  }
}
