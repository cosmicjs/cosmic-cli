'use strict'
var Configstore = require('configstore')
var pkg = require('../package.json')
var request = require('request')
var inquirer = require('inquirer')
var async = require('async')
var Cosmic = require('cosmicjs')

var conf = new Configstore(pkg.name)
var TOKEN_KEY = 'token'
var EMAIL_KEY = 'email'

function getCosmicToken() {
  return conf.get(TOKEN_KEY)
}

function getActiveEmail() {
  return conf.get(EMAIL_KEY)
}

function setToken(callback) {
  var locals = {}
  async.series([
    function(asyncCallback) {
      var questions = [
        {
          type: 'confirm',
          name: 'sso',
          message: 'Did you use GitHub, Gmail, or SSO to login?',
        }
      ]
      inquirer.prompt(questions).then(function(answers) {
        if(answers.sso)
          locals.sso = true
        return asyncCallback()
      })
    },
    function(asyncCallback) {
      if (!locals.sso)
        return asyncCallback()
      var questions = [
        {
          type: 'text',
          name: 'token',
          message: 'What is your authentication token? Find this at https://app.cosmicjs.com/account/authentication',
        }
      ]
      inquirer.prompt(questions).then(function(answers) {
        conf.set(TOKEN_KEY, answers.token)
        conf.set(EMAIL_KEY, locals.email)
        return callback(null, answers.token)
      })
    },
    function(asyncCallback) {
      var questions = [
        {
          type: 'text',
          name: 'email',
          message: 'Email:',
        },
        {
          type: 'password',
          name: 'password',
          message: 'Password:',
        },
      ]
      inquirer.prompt(questions).then(function(answers) {
        Cosmic().authenticate({
          email: answers.email,
          password: answers.password
        }).then(data => {
          var token = data.token
          if (!token) {
            return callback('Could not authenticate')
          }
          // save the token
          conf.set(TOKEN_KEY, token)
          conf.set(EMAIL_KEY, answers.email)
          return callback(null, token)
        }).catch(data => {
          if (err || !body) {
            return callback('Could not authenticate')
          }
        })
      })
    }
  ])
}

module.exports = {
  getCosmicToken: getCosmicToken,
  getActiveEmail: getActiveEmail,
  setToken: setToken,
}
