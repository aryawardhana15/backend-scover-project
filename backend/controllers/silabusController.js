const db = require('../config/db');

exports.getAllSilabus = (req, res) => {
  db.query('SELECT * FROM silabus', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createSilabus = (req, res) => {
  const { nama, deskripsi } = req.body;
  db.query('INSERT INTO silabus (nama, deskripsi) VALUES (?, ?)', [nama, deskripsi], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, nama, deskripsi });
  });
}; 