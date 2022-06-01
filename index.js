#!/usr/bin/env node
var program = require('commander')

var commands = require('./commands')
var auth = require('./lib/cosmic_auth')
var bucketConfig = require('./lib/bucket_config')
var print = require('./lib/output')
var colors = require('colors')
var customScripts = require('./non_standard_commands')
var packageInfo = require('./package.json')


var token = auth.getCosmicToken()
var Cosmic = require('cosmicjs')({
  token: token
})
var bucketOpts = bucketConfig.getCosmicBucketOptions()
var bucket = Cosmic.bucket(bucketOpts)

program
  .version(packageInfo.version)

commands.forEach(function(command) {

  var buildUp = program
    .command(command.cmd)
    .description(command.description)
  if (command.options) {
    command.options.forEach(function(option) {
      buildUp.option(option.flags, option.description)
    })
  }

  var regExp = /\[([^\]]+)\]/
  var argumentParamName = regExp.exec(command.cmd)
  argumentParamName = argumentParamName ? argumentParamName[1] : null

  if (argumentParamName) {
    buildUp
      .action(handleArg)
  } else {
    buildUp
      .action(handleNoArg)
  }

  function handleNoArg(invokedCmd) {
    handleAction(null, invokedCmd)
  }

  function handleArg(arg, invokedCmd) {
    var argObj = {
      argumentParamName: argumentParamName,
      arg: arg
    }
    handleAction(argObj, invokedCmd)
  }

  function handleAction(argObj, invokedCmd){
    if (command.requiresToken && !token) {
      print.error('Authentication required! Please type `cosmic login` to authenticate.')
      process.exit(1)
    }

    if (command.custom) {
      runCustomScript(command, invokedCmd, argObj)
    } else {
      runCosmicCommand(command, invokedCmd, argObj)
    }
  }
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
} else {
  var receivedCmd = program.args[program.args.length - 1] || {}
  if (!receivedCmd._name) {
    print.error('Unrecognized command')
  }
}

function runCustomScript(command, invokedCmd, argObj) {
  if (!customScripts[command.customScript]) {
    print.error('Error with custom command ' + command.cmd + '. Please report this at ' + colors.blue('https://github.com/cosmicjs/cosmic-cli/issues/'))
    process.exit(1)
  }

  customScripts[command.customScript]({
    invokedCmd: invokedCmd,
    bucket: bucket,
    token: token,
    argObj: argObj,
    Cosmic: Cosmic,
  })
}

function runCosmicCommand(command, invokedCmd, argObj) {
  var params = parseCosmicParameters(command, invokedCmd, argObj)
  // some commands have flags that, if present, change the cosmic method we should use
  var overrideCommand
  command.options.forEach(function(option) {
    var cosmicParamName = option.cosmicParamName || option.param
    if (option.switchToCommandIfPresent && params[cosmicParamName]) {
      overrideCommand = option.switchToCommandIfPresent
    }
  })

  var cosmicMethod = overrideCommand || command.cosmicMethod || {}

  var scope = cosmicMethod.useBucket ? bucket : Cosmic

  if (!scope[cosmicMethod.method]) {
    var scopeStr = cosmicMethod.useBucket ? 'Cosmic.bucket' : 'Cosmic'
    print.error('Method ' + cosmicMethod.method + ' does not exist on ' + scopeStr + '. Please report this at ' + colors.blue('https://github.com/cosmicjs/cosmic-cli/issues/'))
    process.exit(1)
  }

  scope[cosmicMethod.method](params).then(function(res){
    if (res.status && res.status !== 200) {
      print.error('Error:')
      console.log(res)
      process.exit(1)
    }
    print.success('Success')
    console.log(res)
    process.exit(0)
  }).catch(function(err) {
    print.error('Error:')
    console.log(err)
    process.exit(1)
  })
}

function parseCosmicParameters(command, invokedCmd, argObj) {
  var params = {}
  command.options.forEach(function(option) {
    var paramValue = invokedCmd[option.param]
    var addToParams = true
    if (paramValue && option.isJsonString) {
      try {
        var jsonObj = JSON.parse(paramValue)
        paramValue = jsonObj

        if (option.isWrapperParameter) {
          params = Object.assign(params, paramValue) // if this a wrapper for real parameters (like --json) assign those
          addToParams = false
        }

      } catch (e) {
        print.error('Failed to parse json string for argument ' + option.param + '. Please verify the json is correctly structured and has quotes around both keys and values.')
        process.exit(1)
      }
    }

    var cosmicParamName = option.cosmicParamName || option.param

    if (addToParams) { // add the option directly to params unless a special case occurred that flipped addToParams to false
      params[cosmicParamName] = paramValue
    }
  })

  if (argObj && argObj.arg) {
    params[argObj.argumentParamName] = argObj.arg
  }


  return params
}
