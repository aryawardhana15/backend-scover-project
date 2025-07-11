const db = require('../config/db');

exports.getAllJadwalSesi = (req, res) => {
  db.query('SELECT * FROM jadwal_sesi', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createJadwalSesi = (req, res) => {
  const { kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status } = req.body;
  db.query(
    'INSERT INTO jadwal_sesi (kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status });
    }
  );
}; 