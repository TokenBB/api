var { Client, PrivateKey, Authority } = require('dsteem')

const usage = `usage: node scripts/create-account <account> <wif> <new-account-name> <password>`

main()

function main () {
  var args = process.argv.slice(2)
  var account = args[0]
  var wif = args[1]
  var newAccountName = args[2]
  var password = args[3]

  if (!account || !wif || !newAccountName || !password) return console.log(usage)

  createAccount(account, wif, newAccountName, password)
}

async function createAccount (account, wif, newAccountName, password) {
  var client = new Client('https://api.steemit.com')
  var privateKey = PrivateKey.fromString(wif)

  var ownerKey = PrivateKey.fromLogin(newAccountName, password, 'owner')
  var activeKey = PrivateKey.fromLogin(newAccountName, password, 'active')
  var postingKey = PrivateKey.fromLogin(newAccountName, password, 'posting')
  var memoKey = PrivateKey.fromLogin(newAccountName, password, 'memo')

  const op = [
    'create_claimed_account',
    {
      creator: account,
      new_account_name: newAccountName,
      owner: Authority.from(ownerKey.createPublic()),
      active: Authority.from(activeKey.createPublic()),
      posting: Authority.from(postingKey.createPublic()),
      memo_key: memoKey.createPublic().toString(),
      json_metadata: '',
      extensions: []
    }
  ]

  client.broadcast.sendOperations([ op ], privateKey).then(
    function (result) {
      console.log(result)
    },
    async function (error) {
      console.log(error)
    }
  )
}
