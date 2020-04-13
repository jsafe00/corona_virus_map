const ghpages = require('gh-pages')

ghpages.publish(
  'public',
  {
    branch: 'master',
    repo: 'https://github.com/jsafe00/coronavirusmap.git',
  },
  () => {
    console.log('Deploy Complete!')
  }
)