var print = require('../lib/output')
var Cosmic = require('cosmicjs')
var opn = require('opn')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var appBucket = Cosmic().bucket({
    slug: 'cosmicapps'
  })
  var demoLink = 'https://cosmicjs.com/apps/' + invokedCmd + '/demo'
  if (!demoLink) {
    print.cosmic('No demo for this app found. Please visit ' + metadata.repo + ' to explore more.' )
  }

  // open in user's default browser
  opn(demoLink)
  process.exit()
}

module.exports = handler
