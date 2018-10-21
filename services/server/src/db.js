var mysql = require('mysql2')

class DB {
  constructor () {
    this._opts = {
      database: process.env.ACCOUNT_NAME,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      connectionLimit: 100 // important
    }

    this.pool = mysql.createPool(this._opts)
    this.execute = this.pool.execute.bind(this.pool)
    this.query = this.pool.query.bind(this.pool)
  }

  start () {
    return Promise.resolve()
  }
}

module.exports = new DB()
