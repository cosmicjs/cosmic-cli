var auth = require('../lib/cosmic_auth')
var print = require('../lib/output')


function handler() {
  auth.setToken(function(err, token) {
    if (err || !token) {
      print.error('Authentication Failed')
      process.exit(1)
    } else {
      print.success('Authenticated')
      process.exit()
    }
  })
}

module.exports = handler
