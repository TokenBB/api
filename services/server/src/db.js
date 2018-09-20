const DELAY = 3000

var mysql = require('mysql2/promise')

class DB {
  constructor () {
    this._opts = {
      database: 'tokenbb',
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD
    }
  }

  start () {
    return mysql.createConnection(this._opts)
      .then(connection => this._connect(connection))
      .catch(err => this._retry(err))
  }

  execute (statement, values, callback) {
    if (values) return this._connection.execute(statement, values, callback)

    return this._connection.execute(statement, callback)
  }

  _retry (err) {
    console.log(err.message)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.start())
      }, DELAY)
    })
  }

  _connect (connection) {
    this._connection = connection
  }
}

module.exports = new DB()
