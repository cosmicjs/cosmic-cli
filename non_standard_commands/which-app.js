var appConfig = require('../lib/app_config')
var print = require('../lib/output')

function handler() {
  var app = appConfig.getCosmicAppOptions()
  if (!app) {
    print.error('No active Bucket found')
  }
  print.cosmic('title:  ' + app.title)
  print.cosmic('slug:   ' + app.slug)
}

module.exports = handler
