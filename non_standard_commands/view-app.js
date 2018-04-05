var print = require('../lib/output')
var Cosmic = require('cosmicjs')
var opn = require('opn')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var appBucket = Cosmic().bucket({
    slug: 'cosmicapps'
  })
  appBucket.getObject({
    slug: invokedCmd
  }).then(function(data) {
    var object = data.object
    var metadata = object.metadata || {}
    var demoLink = metadata.demo_link
    if (!demoLink) {
      print.cosmic('No demo for this app found. Please visit ' + metadata.repo + ' to explore more.' )
    }

    // open in user's default browser
    opn(demoLink)
    process.exit()

  }).catch(function(err) {
    print.error('Error')
    console.log(err)
    process.exit(1)
  })
}

module.exports = handler
