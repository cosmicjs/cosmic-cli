/*
  These scripts are for commands that are not part of the cosmic-node library
  and thus must be implemented by us
*/

module.exports.login = require('./login')
module.exports.whichUser = require('./which-user')
module.exports.useBucket = require('./use-bucket')
module.exports.whichBucket = require('./which-bucket')
module.exports.addMedia = require('./add-media')
module.exports.begin = require('./begin')
module.exports.getBuckets = require('./get-buckets')
module.exports.installApp = require('./install-app')
module.exports.deployApp = require('./deploy-app')
module.exports.viewApp = require('./view-app')
module.exports.browseApps = require('./browse-apps')
module.exports.startApp = require('./start-app')
