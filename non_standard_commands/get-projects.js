var print = require('../lib/output')
var Cosmic = require('cosmicjs')

function handler(options) {
  var invokedCmd = options.invokedCmd
  Cosmic({
    token: options.token
  }).getProjects().then(data => {
    if (!data) {
      print.error('Issue fetching buckets.')
      process.exit(1)
    }
    if (invokedCmd.json) {
      print.cosmic('Your Buckets (json format):')
      console.log(body.buckets)
    } else {
      print.cosmic('Your Buckets (title and slug):')
      console.log('')
      var buckets = data.buckets || []
      buckets.forEach(function(bucket) {
        console.log(bucket.title)
        print.cosmic(bucket.slug)
        console.log('')
      })
    }
  }).catch(err => {
    print.error(err)
    process.exit(1)
  })
}

module.exports = handler
