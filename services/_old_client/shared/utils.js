module.exports.samePost = function (a, b) {
  return a.author === b.author && a.permlink === b.permlink
}
