'use strict'
var Configstore = require('configstore')
var pkg = require('../package.json')

var Cosmic = require('cosmicjs')()

var conf = new Configstore(pkg.name)
var BUCKET_KEY = 'bucket'

function getCosmicBucketOptions() {
  var options = conf.get(BUCKET_KEY)
  if (options) {
    return JSON.parse(options)
  } else {
    return {}
  }
}

function setBucket(options, callback) {
  var bucket = Cosmic.bucket({
    slug: options.slug,
    read_key: options.read_key || '',
    write_key: options.write_key || '',
  })
  // run a test get query on the bucket to check that slug and read_key is valid
  // this allows for more helpful error throwing than the user getting an error next time they issue a command.
  bucket.getBucket({hide_metafields: true}).then(function(body) {
    if (!body || !body.bucket) {
      return callback('Unable to connect to bucket. Do you have the correct read_key?')
    }
    var title = body.bucket.title
    conf.set(BUCKET_KEY, JSON.stringify({
      slug: options.slug,
      title: title,
      read_key: options.read_key || '',
      write_key: options.write_key || '',
    }))
    return callback(null, options)
  }).catch(function(err) {
    return callback(err)
  })
}

module.exports = {
  getCosmicBucketOptions: getCosmicBucketOptions,
  setBucket: setBucket,
}
