var bucketConfig = require('../lib/bucket_config')
var print = require('../lib/output')

function handler(invokedCmd) {
  var bucket = {
    slug: invokedCmd.slug || invokedCmd,
    read_key: invokedCmd.read_key,
    write_key: invokedCmd.write_key,
  }
  bucketConfig.setBucket(bucket, function(err, options) {
    if (err) {
      print.error(err.error)
      process.exit(1)
    } else {
      print.success('Now using Bucket ' + options.slug)
      process.exit()
    }
  })
}

module.exports = handler
