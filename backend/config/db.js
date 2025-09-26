const mysql = require('mysql2');
const db = mysql.createPool({
  host: 'localhost',
  user: 'mysf9481_penjadwalanscover',
  password: '@Hafiz1180', 
  database: 'mysf9481_penjadwalan_scover' 
});

module.exports = db; 