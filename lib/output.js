var colors = require('colors')

module.exports.error = function(error) {
  console.log(colors.red(error))
}

module.exports.success = function(message) {
  console.log(colors.green(message))
}
