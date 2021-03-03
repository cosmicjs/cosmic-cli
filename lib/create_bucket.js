'use strict'

var bucketConfig = require('./bucket_config')
var inquirer = require('inquirer')

var auth = require('./cosmic_auth')
var token = auth.getCosmicToken()
var Cosmic = require('cosmicjs')({
  token: token
})

function createNewBucket() {
  var questions = [
    {
      type: 'input',
      name: 'title',
      message: 'Title:'
    },
    {
      type: 'input',
      name: 'slug',
      message: 'Slug [optional]:'
    }
  ]
  return inquirer.prompt(questions)
    .then(function(answers) {
      return Cosmic.addBucket({
        title: answers.title,
        slug: answers.slug
      }).then(function(result) {
        if (result.bucket) {
          var read_key = result.bucket.api_access.read_key;
          var write_key = result.bucket.api_access.write_key;
          var bucket = {
            slug: result.bucket.slug,
            read_key: read_key,
            write_key: write_key
          }
          return bucketConfig.setBucket(bucket)
            .then(function() {
              return Object.assign(result.bucket, {
                read_key: read_key,
                write_key: write_key
              })
            })
        } else {
          throw new Error('Bucket not created successfully')
        }
      })
    })
}

module.exports = createNewBucket
