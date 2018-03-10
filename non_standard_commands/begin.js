var print = require('../lib/output')


function handler() {
  print.cosmic('Welcome to the Cosmic CLI! Everything you love about Cosmic, now at your fingertips on the command line!')

  print.underline('To get started, log in by issuing the command:')

  print.bold('cosmic login')

  console.log()

  print.normal('Then, connect to a bucket you want to work with:')

  print.bold('cosmic use-bucket')

  console.log()

  print.normal('Or create a new one!')

  print.bold('cosmic add-bucket')

  console.log()

  print.cosmic('And you\'re ready to go. Type `cosmic -h` to see the list of commands, and `cosmic [command] -h` to get details on a specific command.')
}

module.exports = handler
