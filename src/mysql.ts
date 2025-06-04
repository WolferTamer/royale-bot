import updateTables from "./db/initdb"
import * as mysql from 'mysql2/promise'

try {
  var pool = mysql.createPool({
    connectionLimit:10,
    host:process.env.MYSQL_HOST ? process.env.MYSQL_HOST: 'localhost',
    user:process.env.MYSQL_USER ? process.env.MYSQL_USER: 'royale',
    password:process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD: '',
    database:'royale'
  })
  //have to create tables, or alter them if they already exist.
  updateTables(pool)
  
} catch(e) {
  console.error("[ERROR] Failed to connect to the MySQL database, stopping.")
  process.exit(1)
}

export default pool