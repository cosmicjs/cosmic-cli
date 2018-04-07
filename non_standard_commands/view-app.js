var print = require('../lib/output')
var Cosmic = require('cosmicjs')
var opn = require('opn')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var demoLink = 'https://cosmicjs.com/apps/' + invokedCmd + '/demo'
  // open in user's default browser
  opn(demoLink)
  process.exit()
}

module.exports = handler
