var print = require('../lib/output')
var request = require('request')
var Cosmic = require('cosmicjs')
var async = require('async')
var exec = require('child_process').exec
var bucketConfig = require('../lib/bucket_config')
var bucket_opts = bucketConfig.getCosmicBucketOptions()
var appConfig = require('../lib/app_config')

function handler() {

  async.series([
    function() {
      var PORT = process.env.PORT || 3000
      console.log(bucket_opts.slug)
      var start_command = 'COSMIC_BUCKET=' + bucket_opts.slug + ' PORT=' + PORT + ' NODE_ENV=development npm run develop;'
      console.log(start_command)
      print.success('Starting app on port number ' + PORT + ' connected to Bucket ' + bucket_opts.slug + '.  Open your browser to http://localhost:' + PORT)
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
