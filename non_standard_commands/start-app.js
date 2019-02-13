var print = require('../lib/output')
var request = require('request')
var Cosmic = require('cosmicjs')
var async = require('async')
var exec = require('child_process').exec
var bucketConfig = require('../lib/bucket_config')
var bucket_opts = bucketConfig.getCosmicBucketOptions()
var appConfig = require('../lib/app_config')

function handler() {

  var appSlug = appConfig.getCosmicAppOptions().slug
  if (!appSlug) {
    print.error('No app set or specified')
    return
  }

  async.series([
    function(callback) {
      var install_command = 'cd ./' + appSlug + '; npm i;'
      exec(install_command, function(error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
        } else {
          print.success('App deps installed')
          callback()
        }
      })
    },
    function() {
      var PORT = process.env.PORT || 3000
      console.log(bucket_opts.slug)
      var start_command = 'cd ./' + appSlug + '; cross-env COSMIC_BUCKET=' + bucket_opts.slug + ' PORT=' + PORT + ' npm start;'
      console.log(start_command)
      print.success('Starting app on port number ' + PORT + ' connected to Bucket ' + bucket_opts.slug + '.  Open your browser to http://localhost:3000')
      var child = exec(start_command, function(error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
        } else {
          print.success('App started!')
        }
      })
      child.stdout.on('data', function(data) {
        console.log(data)
      })
    }
  ])
}

module.exports = handler
