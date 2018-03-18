var print = require('../lib/output')
var request = require('request')
var Cosmic = require('cosmicjs')
var exec = require('child_process').exec;

function handler(invokedCmd, bucket, token) {
  var bucket = Cosmic().bucket({
    slug: 'cosmicapps'
  })
  bucket.getObject({
    slug: invokedCmd
  }).then(data => {
    var repo_url = data.object.metadata.repo;
    print.cosmic('Cloning repo: ' + repo_url);
    exec('git clone ' + repo_url + ' ./' + invokedCmd, function(error, stdout, stderr) {
      if (error !== null) {
          console.log('exec error: ' + error);
      } else {
        print.success('Success! Now you can run the start command to run this app:')
        print.cosmic('cosmic start-app ' + invokedCmd);
      }
    });
  }).catch(err => {
    print.error('Error')
    console.log(err)
    process.exit(1)
  });
}

module.exports = handler
