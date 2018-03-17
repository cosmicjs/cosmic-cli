var print = require('../lib/output')
var fs = require('fs')
var upath = require('upath')


function handler(options) {
  var invokedCmd = options.invokedCmd
  var bucket = options.bucket
  
  var buffer = fs.readFileSync(invokedCmd.file)

  var fileExt = upath.extname(invokedCmd.file)
  var originalname = upath.defaultExt(invokedCmd.title || 'media', fileExt)
  var media_object = { originalname: originalname, buffer: buffer }

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
