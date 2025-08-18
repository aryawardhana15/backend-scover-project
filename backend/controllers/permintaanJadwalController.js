const db = require('../config/db');

exports.getAllPermintaan = (req, res) => {
  db.query('SELECT * FROM permintaan_jadwal', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.createPermintaan = (req, res) => {
  const { user_id, mentor_id, kelas_id, tanggal, sesi, status } = req.body;
  db.query(
    'INSERT INTO permintaan_jadwal (user_id, mentor_id, kelas_id, tanggal, sesi, status) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, mentor_id, kelas_id, tanggal, sesi, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
      res.json({ id: result.insertId, user_id, mentor_id, kelas_id, tanggal, sesi, status });
    }
  );
};

exports.getPermintaanByUser = (req, res) => {
  const userId = req.params.user_id;
  db.query('SELECT * FROM permintaan_jadwal WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.approvePermintaan = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE permintaan_jadwal SET status = "approved" WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ message: 'Permintaan jadwal disetujui' });
  });
};

exports.rejectPermintaan = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE permintaan_jadwal SET status = "rejected" WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ message: 'Permintaan jadwal ditolak' });
  });
};
