const db = require('../config/db');

exports.getAllMentors = (req, res) => {
  db.query('SELECT * FROM mentors', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createMentor = (req, res) => {
  const { nama, email, password } = req.body;
  db.query('INSERT INTO mentors (nama, email, password) VALUES (?, ?, ?)', [nama, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, nama, email });
  });
};

// Tambahkan endpoint login mentor
exports.loginMentor = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT id, email FROM mentors WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ error: 'Login gagal' });
    // Kirim data mentor lengkap
    res.json({ id: results[0].id, email: results[0].email, role: 'mentor' });
  });
};

// Endpoint: GET /mentors/:id/jadwal
exports.getJadwalMentor = (req, res) => {
  const mentorId = req.params.id;
  db.query(
    `SELECT js.*, k.nama AS nama_kelas 
     FROM jadwal_sesi js
     JOIN kelas k ON js.kelas_id = k.id
     WHERE js.mentor_id = ? AND (js.status = 'scheduled' OR js.status = 'approved')
     ORDER BY js.tanggal DESC`,
    [mentorId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
}; 

// Endpoint: GET /mentors/available?mapel_id=...&tanggal=...&sesi=...&kelas_id=...
exports.getAvailableMentors = (req, res) => {
  const { mapel_id, tanggal, sesi, kelas_id } = req.query;
  if (!mapel_id || !tanggal || !sesi) {
    return res.status(400).json({ error: 'mapel_id, tanggal, sesi wajib diisi' });
  }
  // Ambil hari dari tanggal
  const hari = new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long' });
  // 1. Mentor harus bisa mapel tsb
  // 2. Mentor available di hari/sesi tsb
  // 3. Tidak ada jadwal tabrakan di jadwal_sesi pada tanggal & sesi tsb
  // 4. Tidak sedang mengajar kelas lain di waktu tsb
  const sql = `
    SELECT m.id, m.nama, m.email
    FROM mentors m
    JOIN mentor_mata_pelajaran mmp ON m.id = mmp.mentor_id
    LEFT JOIN availability_mentor am ON m.id = am.mentor_id AND am.hari = ? AND am.sesi = ? AND am.is_available = 1
    WHERE mmp.mata_pelajaran_id = ?
      AND am.id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM jadwal_sesi js
        WHERE js.mentor_id = m.id AND js.tanggal = ? AND js.sesi = ?
      )
  `;
  db.query(sql, [hari, sesi, mapel_id, tanggal, sesi], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
}; 