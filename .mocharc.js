module.exports = {
  diff: true,
  extension: ['js'],
  package: './package.json',
  slow: 75,
  spec: 'lib/**/test/**/*.js',
  timeout: 20000,
  'watch-files': ['lib/**/*.js'],
  'watch-ignore': ['lib/vendor', 'node_modules/']
}