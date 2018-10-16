var { Client, PrivateKey } = require('dsteem')

const usage = `usage: node scripts/create-account <account> <wif>`

main()

function main () {
  var args = process.argv.slice(2)
  var account = args[0]
  var wif = args[1]

  if (!account || !wif) return console.log(usage)

  claimAccount(account, wif)
}

async function claimAccount (account, wif) {
  var client = new Client('https://api.steemit.com')
  var privateKey = PrivateKey.fromString(wif)

  const op = [
    'claim_account',
    {
      fee: '0.000 STEEM',
      creator: account,
      extensions: []
    }
  ]

  client.broadcast.sendOperations([ op ], privateKey).then(
    function (result) {
      console.log(result)
    },
    async function (error) {
      console.error(error, error.message.split(' '))
      var rcManaNeeded = parseInt(error.message.split(' ')[3])
      console.error(`need mana: ${rcManaNeeded}`)
      var rcAccs = await client.call('rc_api', 'find_rc_accounts', { accounts: [ account ] })
      var [ rcAcc ] = rcAccs.rc_accounts
      var rcManaCurrent = parseInt(rcAcc.rc_manabar.current_mana)
      var percentage = (rcManaCurrent / (rcManaCurrent + rcManaNeeded)) * 100
      console.log(`We are at ${percentage.toFixed(3)}% of needed RC Mana to claim an account.`)
    }
  )
}
