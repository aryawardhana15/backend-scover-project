const db = require('../config/db');

exports.getAllHistory = (req, res) => {
  db.query('SELECT * FROM history_materi', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createHistory = (req, res) => {
  const { user_id, kelas_id, mentor_id, silabus_id, minggu_ke, tanggal } = req.body;
  db.query(
    'INSERT INTO history_materi (user_id, kelas_id, mentor_id, silabus_id, minggu_ke, tanggal) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, kelas_id, mentor_id, silabus_id, minggu_ke, tanggal],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, user_id, kelas_id, mentor_id, silabus_id, minggu_ke, tanggal });
    }
  );
}; 