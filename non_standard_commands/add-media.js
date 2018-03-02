var print = require('../lib/output')
var fs = require('fs')


function handler(invokedCmd, bucket) {
  var buffer = fs.readFileSync(invokedCmd.file)
  var media_object = { originalname: invokedCmd.title || 'media', buffer: buffer }

  bucket.addMedia({
    media: media_object,
    folder: invokedCmd.folder,
  }).then(function(res) {
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
