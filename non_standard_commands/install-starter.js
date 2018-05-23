var print = require('../lib/output')
var exec = require('child_process').exec
var path = require('path')
var starter_repos = {
  'node-starter': 'https://github.com/cosmicjs/node-starter'
}

function handler(options) {
  var invokedCmd = options.invokedCmd
  var argObj = options.argObj || {}
  var nameArg = argObj.argumentParamName === 'name' ? argObj.arg : null
  var repo_url = starter_repos[nameArg]
  exec('git clone ' + repo_url, function(error) {
    if (error !== null) {
      console.log('exec error: ' + error)
    } else {
      print.success('Success!')
      var appPath = path.join(process.cwd(), nameArg)
      print.cosmic('Starter app code located at ' + appPath)
      print.success('To start this app run these commands')
      print.cosmic('cd node-starter')
      print.cosmic('npm i')
      print.cosmic('cosmic start')
    }
  })
}
module.exports = handler
