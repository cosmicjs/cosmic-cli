var print = require('../lib/output')
var request = require('request')
var Cosmic = require('cosmicjs')
var exec = require('child_process').exec

function handler(options, bucket, token) {
  var invokedCmd = options.invokedCmd
  var appBucket = Cosmic().bucket({
    slug: 'cosmicapps'
  })
  appBucket.getObject({
    slug: invokedCmd
  }).then(function(data) {
    var repo_url = data.object.metadata.repo
    print.cosmic('Cloning repo: ' + repo_url)
    exec('git clone ' + repo_url + ' ./' + invokedCmd, function(error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error)
      } else {
        print.success('Success! Now you can run the start command to run this app:')
        print.cosmic('cosmic start-app ' + invokedCmd)
      }
    })
  }).catch(function(err) {
    print.error('Error')
    console.log(err)
    process.exit(1)
  })
}

module.exports = handler
