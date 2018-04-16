var print = require('../lib/output')
var Cosmic = require('cosmicjs')
var striptags = require('striptags')

function handler(options) {
  var invokedCmd = options.invokedCmd
  var appBucket = Cosmic().bucket({
    slug: 'cosmicapps'
  })
  appBucket.getObjectsByType({
    type_slug: 'apps'
  }).then(function(data) {
    if (!data.objects) {
      print.error('No objects matched your search.')
      process.exit()
    }

    data.objects.forEach(function(object) {
      var languages = object.metadata.languages || []
      var languageString = createLanguageString(languages)

      if (matchesSearch(invokedCmd.q, object)) {
        print.cosmic(object.title)
        console.log(striptags(object.content))
        console.log('Built with: ' + languageString)
        console.log('Install: cosmic install-app ' + object.slug)
        console.log('')
      }
    })
  }).catch(function(err) {
    print.error('Error')
    console.log(err)
    process.exit(1)
  })
}

function matchesSearch(query, app) {
  if (!query || query === '' || typeof query !== 'string') {
    return true
  }
  var titleMatch = app.title.toLowerCase().includes(query.toLowerCase())
  var descriptionMatch = striptags(app.content).toLowerCase().includes(query.toLowerCase())
  var languageMatch = createLanguageString(app.metadata.languages).toLowerCase().includes(query.toLowerCase())

  return titleMatch || descriptionMatch || languageMatch
}

function createLanguageString(languages) {
  languages = languages || []
  return languages.map(function(lang) { return lang.language.title }).join(', ')
}

module.exports = handler
