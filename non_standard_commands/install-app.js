var print = require('../lib/output')
var request = require('request')
var Cosmic = require('cosmicjs')
var exec = require('child_process').exec
var inquirer = require('inquirer')
var bucketConfig = require('../lib/bucket_config')
var path = require('path')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var appBucket = Cosmic().bucket({
    slug: 'cosmicapps'
  })
  appBucket.getObject({
    slug: invokedCmd
  }).then(function(data) {
    var bucketOpts = bucketConfig.getCosmicBucketOptions()

    var questions = [
      {
        type: 'confirm',
        name: 'confirm',
        message: 'DANGER! Are you sure you want to overwrite all data and files in the Bucket: ' + bucketOpts.slug + '?',
      },
    ]
    inquirer.prompt(questions).then(function(answers) {
      if (!answers.confirm) {
        print.error('Install Cancelled')
        return process.exit(1)
      }

      var repo_url = data.object.metadata.repo
      print.cosmic('Installing...')
      exec('git clone ' + repo_url + ' ' + invokedCmd, function(error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
        } else {
          print.success('Success!')
          var appPath = path.join(process.cwd(), invokedCmd)
          print.cosmic('App code located at ' + appPath)
          print.success('To start this app run this command')
          print.cosmic('cosmic start-app ' + invokedCmd)
        }
      })
    })
  }).catch(function(err) {
    print.error('Error')
    console.log(err)
    process.exit(1)
  })
}

module.exports = handler
