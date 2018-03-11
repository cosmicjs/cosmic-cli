var colors = require('colors/safe')

module.exports.error = function(error) {
  console.log(colors.red(error))
}

module.exports.success = function(message) {
  console.log(colors.green(message))
}

module.exports.cosmic = function(message) {
  console.log(colors.cyan(message))
}

module.exports.underline = function(message) {
  console.log(colors.underline(message))
}

module.exports.bold = function(message) {
  console.log(colors.bold(message))
}

module.exports.cosmicCommand = function(message) {
  console.log(colors.bold(message))
}

module.exports.normal = function(message) {
  console.log(message)
}
