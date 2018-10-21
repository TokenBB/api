var { Client, PrivateKey, Authority } = require('dsteem')

const usage = `usage: node scripts/change-password <account> <old-password> <new-password>`

main()

function main () {
  var args = process.argv.slice(2)
  var account = args[0]
  var oldPassword = args[1]
  var newPassword = args[2]

  if (!account || !oldPassword || !newPassword) return console.log(usage)

  createAccount(account, oldPassword, newPassword)
}

async function createAccount (account, oldPassword, newPassword) {
  var client = new Client('https://api.steemit.com')

  var privateKey = PrivateKey.fromLogin(account, oldPassword, 'owner')

  var ownerKey = PrivateKey.fromLogin(account, newPassword, 'owner')
  var activeKey = PrivateKey.fromLogin(account, newPassword, 'active')
  var postingKey = PrivateKey.fromLogin(account, newPassword, 'posting')
  var memoKey = PrivateKey.fromLogin(account, newPassword, 'memo')

  const data = {
    account,
    owner: Authority.from(ownerKey.createPublic()),
    active: Authority.from(activeKey.createPublic()),
    posting: Authority.from(postingKey.createPublic()),
    memo_key: memoKey.createPublic().toString(),
    json_metadata: '',
    extensions: []
  }

  client.broadcast.updateAccount(data, privateKey).then(
    function (result) {
      console.log(result)
    },
    async function (error) {
      console.log(error)
    }
  )
}
