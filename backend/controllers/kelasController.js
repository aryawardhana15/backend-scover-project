const db = require('../config/db');

exports.getAllKelas = (req, res) => {
  db.query('SELECT * FROM kelas', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createKelas = (req, res) => {
  const { nama, tipe } = req.body;
  db.query('INSERT INTO kelas (nama, tipe) VALUES (?, ?)', [nama, tipe], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, nama, tipe });
  });
}; 