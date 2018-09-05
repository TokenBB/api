const { MYSQL_USER, MYSQL_PASSWORD } = process.env

var mysql = require('mysql2')

var db = mysql.createConnection({
  database: 'tokenbb',
  user: MYSQL_USER,
  password: MYSQL_PASSWORD
})

module.exports = db
