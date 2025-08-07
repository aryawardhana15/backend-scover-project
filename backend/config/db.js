const mysql = require('mysql2');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hafiz1180', 
  database: 'penjadwalan_scover' 
});

module.exports = db; 