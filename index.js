#!/usr/bin/env node
var program = require('commander')

var commands = require('./commands')
var auth = require('./lib/cosmic_auth')
var bucketConfig = require('./lib/bucket_config')
var print = require('./lib/output')
var colors = require('colors')
var customScripts = require('./non_standard_commands')


var token = auth.getCosmicToken()
var Cosmic = require('cosmicjs')({
  token: token
})
var bucketOpts = bucketConfig.getCosmicBucketOptions()
var bucket = Cosmic.bucket(bucketOpts)

program
  .version('0.1.0')

commands.forEach(function(command) {
  var buildUp = program
    .command(command.cmd)
    .description('thing')
    // .option("-s, --setup_mode [mode]", "Which setup mode to use")
  command.options.forEach(function(option) {
    buildUp.option(option.flags, option.description)
  })

  buildUp
    .action(function(invokedCmd) {
      if (command.requiresToken && !token) {
        print.error('Authentication required! Please type `cosmic login` to authenticate.')
        process.exit(1)
      }

      if (command.custom) {
        runCustomScript(command, invokedCmd)
      } else {
        runCosmicCommand(command, invokedCmd)
      }
      // load cosmic before this with the token? (like top of file.) check here if auth needed or not.
      // how do we create callbacks through json. All things will have a method in cosmicjs-node?
      // even so, we have to pass the args
    })
})

function runCustomScript(command, invokedCmd) {
  if (!customScripts[command.customScript]) {
    print.error('Error with custom command ' + command.cmd + '. Please report this at ' + colors.blue('https://github.com/cosmicjs/cosmic-cli/issues/'))
    process.exit(1)
  }

  customScripts[command.customScript](invokedCmd)
}

function runCosmicCommand(command, invokedCmd) {
  var params = {}
  command.options.forEach(function(option) {
    params[option.param] = invokedCmd[option.param]
  })

  var cosmicMethod = command.cosmicMethod || {}

  var scope = cosmicMethod.useBucket ? bucket : Cosmic

  if (!scope[cosmicMethod.method]) {
    var scopeStr = cosmicMethod.useBucket ? 'Cosmic.bucket' : 'Cosmic'
    print.error('Method ' + cosmicMethod.method + ' does not exist on ' + scopeStr + '. Please report this at ' + colors.blue('https://github.com/cosmicjs/cosmic-cli/issues/'))
    process.exit(1)
  }

  scope[cosmicMethod.method](params).then(function(res){
    print.success('Success')
    console.log(res)
    process.exit(0)
  }).catch(function(err) {
    print.error('Error:')
    console.log(err)
    process.exit(1)
  })

  // if (!cosmicMethod.useBucket) {
  //   if (!Cosmic[cosmicMethod.method]) {
  //     print.error('Method ' + cosmicMethod.method + ' does not exist on Cosmic. Please report this at ' + colors.blue('https://github.com/cosmicjs/cosmic-cli/issues/'))
  //     process.exit(1)
  //   }
  //
  //
  //   Cosmic[cosmicMethod.method](params).then(function(res){
  //     print.success('Success')
  //     console.log(res)
  //     process.exit(0)
  //   }).catch(function(err) {
  //     print.error('Error:')
  //     console.log(err)
  //     process.exit(1)
  //   })
  // } else {
  //   if (!bucket[cosmicMethod.method]) {
  //     print.error('Method ' + cosmicMethod.method + ' does not exist on Cosmic. Please report this at ' + colors.blue('https://github.com/cosmicjs/cosmic-cli/issues/'))
  //     process.exit(1)
  //   }
  //
  //   Cosmic[cosmicMethod.method](params).then(function(res){
  //     print.success('Success')
  //     console.log(res)
  //     process.exit(0)
  //   }).catch(function(err) {
  //     print.error('Error:')
  //     console.log(err)
  //     process.exit(1)
  //   })
  // }
}

program.parse(process.argv)

// program
//   .version('0.1.0')
//   .arguments('<cmd>')
//   .action(function (cmd) {
//      cmdValue = cmd;
//   });
//
// program.parse(process.argv);
//
// if (typeof cmdValue === 'undefined') {
//   console.error('no command given!');
//   process.exit(1);
// }
//
// if (cmdValue === 'add-bucket') {
// 	getToken(function(token) {
// 		addBucket(token, function(res) {
// 			console.log(res)
// 		})
// 	})
// }
//
// function getToken(callback) {
// 	var questions = [
// 		{
// 			type: 'text',
// 			name: 'email',
// 			message: 'Email:'
// 		},
// 		{
// 			type: 'password',
// 			name: 'password',
// 			message: 'Password:'
// 		}
// 	]
// 	inquirer.prompt(questions).then(function (answers) {
// 		request.post({ url: 'https://api.cosmicjs.com/v1/authenticate', form: {email: answers.email, password: answers.password }}, function(err, httpResponse, body){
// 			return callback(JSON.parse(body).token)
// 		})
// 	})
// }
//
// function addBucket(token, callback) {
// 	var questions = [
// 		{
// 			type: 'text',
// 			name: 'title',
// 			message: 'What is the title of your new Bucket?'
// 		}
// 	]
// 	inquirer.prompt(questions).then(function (answers) {
// 		var headers = {
//       'Authorization': `Bearer ${token}`
//     }
// 		request.post({ headers, url: 'https://api.cosmicjs.com/v1/buckets', form: { title: answers.title } }, function(err, httpResponse, body){
// 			return callback(JSON.parse(body))
// 		})
// 	})
// }


/* Example

var program = require('commander');

program
  .version('0.1.0')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook');

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(env, options){
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });

program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

program.parse(process.argv);

*/
