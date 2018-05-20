var print = require('../lib/output')
var request = require('request')
var Cosmic = require('cosmicjs')
var exec = require('child_process').exec
var inquirer = require('inquirer')
var bucketConfig = require('../lib/bucket_config')
var appConfig = require('../lib/app_config')
var path = require('path')
var createNewBucketInquiry = require('../lib/create_bucket')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var token = options.token
  var appBucket = Cosmic().bucket({
    slug: 'cosmicapps'
  })
  appBucket.getObject({
    slug: invokedCmd
  }).then(function(data) {
    var bucketOpts = bucketConfig.getCosmicBucketOptions()

    var introQuestions
    if (!bucketOpts || !bucketOpts.slug) {
      introQuestions = handleNoBucketSet()
    } else {
      introQuestions = confirmCurrentOrNewBucket(bucketOpts)
    }

    introQuestions.then(function(bucketOpts) {
      print.cosmic('Installing...')
      var bucket = Cosmic({token: token}).bucket(bucketOpts)


      request.get({
        url: data.object.metadata.bucket.url,
        json: true
      }, function(err, httpResponse, body) {
        bucket.getBucket()
          .then(function(bucketToOverwrite) {
            request.post({
              url: 'https://api.cosmicjs.com/v1/buckets/' + bucketToOverwrite.bucket._id + '/import',
              json: body,
              headers: {
                'Authorization': token
              }
            }, function(err, httpResponse, body) {

              if (err || !body.bucket) {
                print.error('Error Installing:')
                console.log(body)
                process.exit(1)
              }

              var repo_url = data.object.metadata.repo
              exec('git clone ' + repo_url + ' ' + invokedCmd, function(error) {
                if (error !== null) {
                  console.log('exec error: ' + error)
                } else {
                  appConfig.set({slug: invokedCmd, title: data.object.title})
                  print.success('Success!')
                  var appPath = path.join(process.cwd(), invokedCmd)
                  print.cosmic('App code located at ' + appPath)
                  print.success('To start this app run this command')
                  print.cosmic('cosmic start-app')
                }
              })
            })
          })
          .catch(function(err) {
            console.log(err)
            process.exit()
          })
      })
    })
      .catch(function(err) {
        print.error('Error')
        console.log(err)
        process.exit(1)
      })
  }).catch(function(err) {
    print.error('Error')
    console.log(err)
    process.exit(1)
  })
}

function confirmCurrentOrNewBucket(bucketOpts) {
  var questions = [
    {
      type: 'list',
      name: 'list',
      message: 'You are connected to ' + bucketOpts.slug + ' and will overwrite its data. Would you like to keep using this bucket or create a new one?',
      choices: [
        {name: 'Use ' + bucketOpts.slug, value: 'old'},
        {name: 'Create new bucket', value: 'new'},
        {name: 'Cancel', value: 'cancel'}
      ]
    },
  ]
  return inquirer.prompt(questions)
    .then(function(answers) {
      switch (answers.list) {
      case 'old':
        return confirmOverwrite(bucketOpts)
      case 'new':
        return createNewBucketInquiry()
      case 'cancel':
        print.error('Install Cancelled')
        return process.exit(1)
      default:
        print.error('Unknown Option. Install cancelled')
        return process.exit(1)
      }
    })
}

function handleNoBucketSet() {
  var questions = [
    {
      type: 'list',
      name: 'list',
      message: 'You do not have a bucket set to deploy to. Please cancel and set one with the `use-bucket` command, or create a new bucket. Would you like to:',
      choices: [
        {name: 'Create new bucket', value: 'new'},
        {name: 'Cancel and connect to existing bucket', value: 'cancel'}
      ]
    }
  ]
  return inquirer.prompt(questions).then(function(answers) {
    switch (answers.list) {
    case 'new':
      return createNewBucketInquiry()
    case 'cancel':
      print.error('Install Cancelled')
      return process.exit(1)
    default:
      print.error('Unknown Option. Install cancelled')
      return process.exit(1)
    }
  })
}

function confirmOverwrite(bucketOpts) {
  var questions = [
    {
      type: 'confirm',
      name: 'confirm',
      message: 'DANGER! Are you sure you want to overwrite all data and files in the Bucket: ' + bucketOpts.slug + '?',
    },
  ]
  return inquirer.prompt(questions).then(function(answers) {
    if (!answers.confirm) {
      print.error('Install Cancelled')
      process.exit(1)
      return
    }
    return bucketOpts
  })
}

module.exports = handler
