require('dotenv').config()

var exec = require('child_process').spawnSync

console.log('Building...')

exec('./node_modules/.bin/bankai', ['build', 'src/client'])

console.log('Done.')
