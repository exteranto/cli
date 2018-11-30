const execa = require('execa')

module.exports = async (name) => {

  await execa('echo', ['unicorns']).stdout.pipe(process.stdout);
}
