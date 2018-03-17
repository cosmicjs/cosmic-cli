var bucketConfig = require('../lib/bucket_config')
var print = require('../lib/output')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var argObj = options.argObj || {}

  var slugArg = argObj.argumentParamName === 'slug' ? argObj.arg : null

  var bucket = {
    slug: slugArg || invokedCmd.slug || invokedCmd,
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
