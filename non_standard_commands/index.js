/*
  These scripts are for commands that are not part of the cosmic-node library
  and thus must be implemented by us
*/

module.exports.login = require('./login')
module.exports.whichUser = require('./which-user')
module.exports.useBucket = require('./use-bucket')
module.exports.whichBucket = require('./which-bucket')
module.exports.addBucket = require('./add-bucket')
module.exports.addMedia = require('./add-media')
module.exports.begin = require('./begin')
module.exports.getBuckets = require('./get-buckets')
module.exports.installStarter = require('./install-starter')
module.exports.startCommand = require('./start-command')
module.exports.developCommand = require('./develop-command')
