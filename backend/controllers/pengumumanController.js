const db = require('../config/db');

exports.getAllPengumuman = (req, res) => {
  db.query('SELECT * FROM pengumuman ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.createPengumuman = (req, res) => {
  const { judul, isi } = req.body;
  const gambar_url = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    'INSERT INTO pengumuman (judul, isi, gambar_url) VALUES (?, ?, ?)',
    [judul, isi, gambar_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
      res.json({ id: result.insertId, judul, isi, gambar_url });
    }
  );
};

exports.deletePengumuman = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM pengumuman WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ message: 'Pengumuman deleted successfully' });
  });
};
