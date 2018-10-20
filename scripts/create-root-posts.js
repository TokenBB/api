var { Client, PrivateKey } = require('dsteem')

const usage = `usage: node scripts/create-root-posts <author> <wif>`
const EMPTY_COMMENT = '[//]: # ()'

main(process.argv.slice(2))

async function main (args) {
  var author = args[0]
  var wif = args[1]

  if (!author || !wif) return console.log(usage)

  var client = new Client('https://api.steemit.com')
  var privateKey = PrivateKey.fromString(wif)
  var taglist = [ 'tokenbb-forum' ]
  var comment = {
    author,
    permlink: `tokenbb-${author.slice(5)}-topics`,
    parent_author: '',
    parent_permlink: taglist[0],
    title: 'Topics',
    body: EMPTY_COMMENT,
    json_metadata: JSON.stringify({
      app: 'tokenbb/0.1',
      tags: taglist
    })
  }

  console.log(comment)

  await client.broadcast.comment(comment, privateKey)
}
