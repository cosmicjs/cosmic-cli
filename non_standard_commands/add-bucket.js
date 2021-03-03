var print = require('../lib/output')
var bucketConfig = require('../lib/bucket_config')


function handler(options) {
  var invokedCmd = options.invokedCmd
  var Cosmic = options.Cosmic


  var params = {
    slug: invokedCmd.slug,
    title: invokedCmd.title,
    cluster: invokedCmd.cluster,
    media_folders: invokedCmd.media_folders,
    webhooks: invokedCmd.webhooks,
    extensions: invokedCmd.extensions
  }

  var res
  Cosmic.addBucket(params)
    .then(function(result) {
      res = result
      var bucket = {
        slug: result.bucket.slug,
        read_key: params.read_key,
        write_key: params.write_key
      }
      return bucketConfig.setBucket(bucket)
    })
    .then(function() {
      print.success('Success')
      console.log(res)
      process.exit()
    }).catch(function(err) {
      print.error('Error')
      console.log(err)
      process.exit(1)
    })
}

module.exports = handler
