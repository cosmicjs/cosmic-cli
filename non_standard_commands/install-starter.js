var print = require('../lib/output')
var exec = require('child_process').exec
var path = require('path')
var inquirer = require('inquirer')
var bucketConfig = require('../lib/bucket_config')
var createNewBucketInquiry = require('../lib/create_bucket')
var starter_repos = {
  'node-starter': 'https://github.com/cosmicjs/node-starter'
}

function handler(options) {
  var invokedCmd = options.invokedCmd
  var argObj = options.argObj || {}
  var nameArg = argObj.argumentParamName === 'name' ? argObj.arg : null
  if (starter_repos[nameArg])
    repo_url = starter_repos[nameArg]
  else
    repo_url = nameArg
  var bucketOpts = bucketConfig.getCosmicBucketOptions()
  print.cosmic('Installing...')
  exec('git clone ' + repo_url, function(error) {
    if (error !== null) {
      console.log('' + error)
    } else {
      print.success('Success!')
      var appPath = path.join(process.cwd(), nameArg)
      print.cosmic('Starter app code located at ' + appPath)
      var introQuestions
      if (!bucketOpts || !bucketOpts.slug) {
        introQuestions = handleNoBucketSet()
      } else {
        introQuestions = confirmCurrentOrNewBucket(bucketOpts)
      }
      introQuestions.then(function(bucketOpts) {
        exec('cd ./' + nameArg + '; npm install; COSMIC_BUCKET=' + bucketOpts.slug + ' COSMIC_WRITE_KEY=' + bucketOpts.write_key + ' npm run import', function(error) {
          print.success('Success! The starter content has been imported to your Bucket: ' + bucketOpts.slug)
          print.normal('')
          print.normal('Begin by typing the following commands:')
          print.normal('')
          print.cosmic('cd node-starter')
          print.cosmic('cosmic start')
          print.normal('   Starts the app in production.')
          print.cosmic('cosmic develop')
          print.normal('   Starts the app in development.')
        }).stdout.on('data', function (data) {
          console.log(data.toString());
        })
      }).catch(function(err) {
        console.log(err)
      })
    }
  })
}

function confirmCurrentOrNewBucket(bucketOpts) {
  var questions = [
    {
      type: 'list',
      name: 'list',
      message: 'You are connected to ' + bucketOpts.slug + ' and will add default content from this starter. Would you like to keep using this bucket or create a new one?',
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
      message: 'You do not have a Bucket set to deploy to. Please cancel and set one with the `use-bucket` command, or create a new bucket. Would you like to:',
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
      message: 'Are you sure you want to import the starter content into the Bucket: ' + bucketOpts.slug + '?',
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
