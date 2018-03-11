'use strict'
var Configstore = require('configstore')
var pkg = require('../package.json')
var request = require('request')
var inquirer = require('inquirer')

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
    request.post({ url: 'https://api.cosmicjs.com/v1/authenticate', form: { email: answers.email, password: answers.password } }, function(err, httpResponse, body) {
      if (err || !body) {
        return callback('Could not authenticate')
      }

      var token = JSON.parse(body).token
      if (!token) {
        return callback('Could not authenticate')
      }

      // save the token
      conf.set(TOKEN_KEY, token)
      conf.set(EMAIL_KEY, answers.email)
      return callback(null, token)
    })
  })
}

module.exports = {
  getCosmicToken: getCosmicToken,
  getActiveEmail: getActiveEmail,
  setToken: setToken,
}
