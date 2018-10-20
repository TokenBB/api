require('dotenv').config({ path: '../../.env' })

var env = [
  'HOST_URL',
  'STEEM_NETWORK',
  'ACCOUNT_NAME',
  'STEEM_CONNECT_HOST'
]

env.forEach(envVar => {
  process.env[`VUE_APP_${envVar}`] = process.env[envVar]
  console.log(envVar, process.env[envVar])
})

module.exports = {
  baseUrl: process.env.HOST_URL
}
