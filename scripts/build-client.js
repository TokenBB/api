require('dotenv').config()

var exec = require('child_process').spawnSync

console.log('Building...')

exec('./node_modules/.bin/bankai', ['build', './src/client', './dist'])
exec('cp', ['./public/*', './dist/'])

console.log('Done.')
