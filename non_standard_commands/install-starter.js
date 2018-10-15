var print = require('../lib/output')
var exec = require('child_process').exec
var path = require('path')
var inquirer = require('inquirer')
var bucketConfig = require('../lib/bucket_config')
var createNewBucketInquiry = require('../lib/create_bucket')
var starter_repos = {
  'node-starter': 'https://github.com/cosmicjs/node-starter',
  'react-starter': 'https://github.com/cosmicjs/react-starter',
  'vue-starter': 'https://github.com/cosmicjs/vue-starter',
  'gatsby-starter': 'https://github.com/cosmicjs/gatsby-starter',
  'gatsby-starter-localization': 'https://github.com/cosmicjs/gatsby-starter-localization',
  'serverless-starter': 'https://github.com/cosmicjs/serverless-starter'
}

function handler(options) {
  var invokedCmd = options.invokedCmd
  var argObj = options.argObj || {}
  var nameArg = argObj.argumentParamName === 'name' ? argObj.arg : null
  if (starter_repos[nameArg])
    repo_url = starter_repos[nameArg]
  else
    repo_url = nameArg
  var folder
  if (invokedCmd.folder)
    folder = invokedCmd.folder
  var bucketOpts = bucketConfig.getCosmicBucketOptions()
  if (!options.token) {
    print.normal('Error: User not set.')
    print.normal('Login to your Cosmic JS account by running the following command, or go to htps://cosmicjs.com to create a new account.')
    print.cosmic('cosmic login')
    return
  }
  var introQuestions
  if (!bucketOpts || !bucketOpts.slug) {
    introQuestions = handleNoBucketSet()
  } else {
    introQuestions = confirmCurrentOrNewBucket(bucketOpts)
  }
  introQuestions.then(function(bucketOpts) {
    if (!repo_url && !folder) {
      console.log('')
      print.error('Error. You must indicate a starter.')
      console.log('')
      console.log('For example:')
      console.log('cosmic init node-starter')
      console.log('')
      return
    }
    print.cosmic('Downloading...')
    exec('git clone ' + repo_url + (folder ? ' ' + folder : ''), function(error) {
      if (error !== null) {
        console.log('' + error)
      } else {
        print.success('Success!')
        var appPath = path.join(process.cwd(), (folder ? folder : nameArg))
        print.cosmic('Starter app code located at ' + appPath)
        print.cosmic('Installing...')
        exec('cd ./' + (folder ? folder : nameArg) + '; npm install; COSMIC_BUCKET=' + bucketOpts.slug + ' COSMIC_WRITE_KEY=' + bucketOpts.write_key + ' npm run import', function(error) {
          print.success('Success! The starter content has been imported to your Bucket: ' + bucketOpts.slug)
          print.normal('')
          print.normal('Begin by typing the following commands:')
          print.normal('')
          print.cosmic('cd ' + (folder ? folder : nameArg))
          print.cosmic('cosmic start')
          print.normal('   Starts the app in production.')
          print.cosmic('cosmic develop')
          print.normal('   Starts the app in development.')
        }).stdout.on('data', function (data) {
          console.log(data.toString());
        })
      }
    })
  }).catch(function(err) {
    console.log(err)
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
      message: 'You do not have a Bucket set. Please cancel and set one with the `use-bucket` command, or create a new Bucket. Would you like to:',
      choices: [
        {name: 'Create new Bucket', value: 'new'},
        {name: 'Cancel and connect to existing Bucket', value: 'cancel'}
      ]
    }
  ]
  return inquirer.prompt(questions).then(function(answers) {
    switch (answers.list) {
    case 'new':
      return createNewBucketInquiry()
    case 'cancel':
      print.normal('Select your Bucket using the `use-bucket` command.  You can list your available Buckets using the `get-buckets` command.')
      print.cosmic('cosmic get-buckets')
      print.cosmic('cosmic use-bucket <bucket-slug>')
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
