var print = require('../lib/output')
var request = require('request')
var Cosmic = require('cosmicjs')
var exec = require('child_process').exec
var inquirer = require('inquirer')
var bucketConfig = require('../lib/bucket_config')
var appConfig = require('../lib/app_config')
var path = require('path')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var token = options.token
  var appBucket = Cosmic().bucket({
    slug: 'cosmicapps'
  })
  var appSlug = appConfig.getCosmicAppOptions().slug
  if (!appSlug) {
    print.error('No app set or specified')
    return
  }
  appBucket.getObject({
    slug: appSlug
  }).then(function(data) {
    var bucketOpts = bucketConfig.getCosmicBucketOptions()

    var questions = [
      {
        type: 'confirm',
        name: 'confirm',
        message: 'DANGER! Are you sure you want to deploy this App connected to Bucket: ' + bucketOpts.slug + '?',
      },
    ]
    inquirer.prompt(questions).then(function(answers) {
      if (!answers.confirm) {
        print.error('Deploy Cancelled')
        return process.exit(1)
      }

      print.cosmic('Deploying...')
      var params = {
        repo_url: invokedCmd.repo_url || data.object.metadata.repo,
        repo_branch: invokedCmd.branch || 'master',
        force_deploy: invokedCmd.force_deploy
      }
      options.bucket.getBucket()
        .then(function(bucketToDeploy) {
          request.post({
            url: 'https://api.cosmicjs.com/v1/buckets/' + bucketToDeploy.bucket._id + '/deploy',
            json: params,
            headers: {
              'Authorization': token
            }
          }, function(err, httpResponse, body) {

            if (err) {
              print.error('Error Deploying:')
              console.log(body)
              process.exit(1)
            } else {
              print.cosmic('Success!')
              console.log(body)
              process.exit(1)
            }
          })
        })
    })
  }).catch(function(err) {
    print.error('Error')
    console.log(err)
    process.exit(1)
  })
}

module.exports = handler
