var print = require('../lib/output')
var request = require('request')

function handler(invokedCmd, bucket, token) {
  request.get({
    url: 'https://api.cosmicjs.com/v1/buckets',
    headers: {
      'Authorization': token
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

    if (invokedCmd.show_full) {
      print.cosmic('Buckets:')
      console.log(body.buckets)
    } else {
      print.cosmic('Slugs:')

      var buckets = body.buckets || []
      buckets.forEach(function(bucket) {
        console.log('- ' + bucket.slug)
      })
    }
  })
}

module.exports = handler