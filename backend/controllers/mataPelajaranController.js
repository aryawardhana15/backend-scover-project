const db = require('../config/db');

exports.getAllMataPelajaran = (req, res) => {
  db.query('SELECT * FROM mata_pelajaran', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.createMataPelajaran = (req, res) => {
  const { nama } = req.body;
  db.query('INSERT INTO mata_pelajaran (nama) VALUES (?)', [nama], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ id: result.insertId, nama });
  });
}; 