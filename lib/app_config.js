'use strict'
var Configstore = require('configstore')
var pkg = require('../package.json')

var Cosmic = require('cosmicjs')()

var conf = new Configstore(pkg.name)
var APP_KEY = 'cosmicApp'

function getCosmicAppOptions() {
  var options = conf.get(APP_KEY)
  if (options) {
    return JSON.parse(options)
  } else {
    return {}
  }
}

function set(options) {
  conf.set(APP_KEY, JSON.stringify({
    slug: options.slug,
    title: options.title,
  }))
}

module.exports = {
  getCosmicAppOptions: getCosmicAppOptions,
  set: set,
}
