var print = require('../lib/output')
var request = require('request')
var Cosmic = require('cosmicjs')
var async = require('async')
var exec = require('child_process').exec
var bucketConfig = require('../lib/bucket_config')
var bucket_opts = bucketConfig.getCosmicBucketOptions()
var opn = require('opn')

function handler(options) {
  var invokedCmd = options.invokedCmd
  
  async.series([
    function(callback) {
      var install_command = 'cd ./' + invokedCmd + '; npm i;'
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
      var start_command = 'cd ./' + invokedCmd + '; COSMIC_BUCKET=' + bucket_opts.slug + ' PORT=' + PORT + ' npm start;'
      console.log(start_command)
      print.success('Starting app on port number ' + PORT + ' connected to Bucket ' + bucket_opts.slug)
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
