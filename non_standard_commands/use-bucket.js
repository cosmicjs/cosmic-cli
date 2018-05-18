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
  bucketConfig.setBucket(bucket)
    .then(function(options) {
      print.success('Now using Bucket ' + options.slug)
      process.exit()
    })
    .catch(function(err) {
      print.error(err.error)
      process.exit(1)
    })
}

module.exports = handler
