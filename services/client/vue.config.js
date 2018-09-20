var env = [
  'NODE_ENV',
  'STEEMD_URL',
  'ADDRESS_PREFIX',
  'CHAIN_ID',
  'APP_ACCOUNT',
  'STEEM_CONNECT_ACCOUNT',
  'STEEM_CONNECT_URL',
  'APP_URL'
]

env.forEach(envVar => {
  process.env[`VUE_APP_${envVar}`] = process.env[envVar]
})

module.exports = {

}
