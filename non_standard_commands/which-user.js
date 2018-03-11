var auth = require('../lib/cosmic_auth')
var print = require('../lib/output')


function handler() {
  var email = auth.getActiveEmail()
  if (!email) {
    print.error('No active user.')
  } else {
    print.cosmic(email)
  }
}

module.exports = handler
