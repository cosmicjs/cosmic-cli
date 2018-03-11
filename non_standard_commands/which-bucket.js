var bucketConfig = require('../lib/bucket_config')
var print = require('../lib/output')

function handler() {
  var bucket = bucketConfig.getCosmicBucketOptions()
  if (!bucket) {
    print.error('No active bucket found')
  }
  print.cosmic(bucket.slug)
}

module.exports = handler
