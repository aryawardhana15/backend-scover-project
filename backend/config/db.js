const mysql = require('mysql2');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Hafiz1180', // Ganti dengan password MySQL Anda
  database: 'penjadwalan_scover' // Ganti dengan nama database Anda
});

module.exports = db; 