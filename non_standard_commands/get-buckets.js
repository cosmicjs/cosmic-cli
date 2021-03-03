var print = require('../lib/output')
var request = require('request')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var token = options.token
  request.get({
    url: 'https://api.cosmicjs.com/v2/buckets',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    json: true
  }, function(err, httpResponse, body) {
    if (err) {
      print.error(err)
      process.exit(1)
    }
    if (!body) {
      print.error('Issue fetching buckets.')
      process.exit(1)
    }
    if (invokedCmd.json) {
      print.cosmic('Your Buckets (json format):')
      console.log(body.buckets)
    } else {
      print.cosmic('Your Buckets (title and slug):')
      console.log('')
      var buckets = body.buckets || []
      buckets.forEach(function(bucket) {
        console.log(bucket.title)
        print.cosmic(bucket.slug)
        console.log('')
      })
    }
  })
}

module.exports = handler
