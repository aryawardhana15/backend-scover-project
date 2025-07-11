const db = require('../config/db');

exports.getAllAdmin = (req, res) => {
  db.query('SELECT * FROM admin', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createAdmin = (req, res) => {
  const { nama, email, password } = req.body;
  db.query('INSERT INTO admin (nama, email, password) VALUES (?, ?, ?)', [nama, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, nama, email });
  });
}; 