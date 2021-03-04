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

function setBucket(options) {
  return Cosmic.getBucket({ slug: options.slug }).then(function(body) {
    if (!body || !body.bucket) {
      return new Error('Unable to connect to bucket. Do you have the correct read_key?')
    }
    var title = body.bucket.title
    conf.set(BUCKET_KEY, JSON.stringify({
      slug: options.slug,
      title: title,
      read_key: options.read_key || '',
      write_key: options.write_key || '',
    }))
    return options
  })
}

module.exports = {
  getCosmicBucketOptions: getCosmicBucketOptions,
  setBucket: setBucket,
}
