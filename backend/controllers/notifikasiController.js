const db = require('../config/db');

exports.getAllNotifikasi = (req, res) => {
  db.query('SELECT * FROM notifikasi', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createNotifikasi = (req, res) => {
  const { user_id, pesan } = req.body;
  db.query('INSERT INTO notifikasi (user_id, pesan) VALUES (?, ?)', [user_id, pesan], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, user_id, pesan });
  });
}; 