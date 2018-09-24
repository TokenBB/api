var env = [
  'HOST_URL',
  'STEEM_NETWORK',
  'STEEM_APP_ACCOUNT',
  'STEEM_CONNECT_HOST',
  'STEEM_CONNECT_ACCOUNT'
]

env.forEach(envVar => {
  process.env[`VUE_APP_${envVar}`] = process.env[envVar]
  console.log(envVar, process.env[envVar])
})

module.exports = {
  baseUrl: process.env.HOST_URL
}
