var bucketConfig = require('../lib/bucket_config')
var print = require('../lib/output')

function handler() {
  var bucket = bucketConfig.getCosmicBucketOptions()
  if (!bucket) {
    print.error('No active Bucket found')
  }
  print.cosmic('title:  ' + bucket.title)
  print.cosmic('slug:   ' + bucket.slug)
}

module.exports = handler
