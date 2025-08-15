const db = require('../config/db');
const { getWeekNumber, getHariFromDate } = require('../utils/dateUtils');

exports.getAllJadwalSesi = (req, res) => {
  db.query('SELECT * FROM jadwal_sesi', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createJadwalSesi = (req, res) => {
  console.log('REQ BODY:', req.body);
  const { kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status, mata_pelajaran_id } = req.body;
  // 1. Cek kemampuan
  db.query('SELECT 1 FROM mentor_mata_pelajaran WHERE mentor_id = ? AND mata_pelajaran_id = ?', [mentor_id, mata_pelajaran_id], (err, rows) => {
    if (err) {
      console.error('DB ERROR (cek kemampuan):', err);
      return res.status(500).json({ error: err });
    }
    if (rows.length === 0) return res.status(400).json({ error: 'Mentor tidak punya kemampuan mengajar mapel ini' });
    // 2. Cek availability
    const date = new Date(tanggal);
    const hari = getHariFromDate(date);
    db.query('SELECT 1 FROM availability_mentor WHERE mentor_id = ? AND minggu_ke = ? AND hari = ? AND sesi = ? AND is_available = 1', [mentor_id, getWeekNumber(date), hari, sesi], (err2, rows2) => {
      if (err2) {
        console.error('DB ERROR (cek availability):', err2);
        return res.status(500).json({ error: err2 });
      }
      if (rows2.length === 0) return res.status(400).json({ error: 'Mentor tidak available di waktu ini' });
      // 3. Cek double teaching
      db.query('SELECT 1 FROM jadwal_sesi WHERE mentor_id = ? AND tanggal = ? AND sesi = ?', [mentor_id, tanggal, sesi], (err3, rows3) => {
        if (err3) {
          console.error('DB ERROR (cek double teaching):', err3);
          return res.status(500).json({ error: err3 });
        }
        if (rows3.length > 0) return res.status(400).json({ error: 'Mentor sudah mengajar di sesi ini pada hari tersebut' });
        // 4. Insert jadwal
        db.query(
          'INSERT INTO jadwal_sesi (kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status],
          (err4, result) => {
            if (err4) {
              console.error('DB ERROR (insert jadwal):', err4);
              return res.status(500).json({ error: err4 });
            }
            // Kirim notifikasi ke mentor
            insertNotifikasiMentor(mentor_id, kelas_id, tanggal, sesi);
            res.json({ id: result.insertId, kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status });
          }
        );
      });
    });
  });
};

exports.getJadwalByUser = (req, res) => {
  const userId = req.params.user_id;
  // Ambil kelas_id user
  const dbUser = require('../config/db');
  dbUser.query('SELECT kelas_id FROM users WHERE id = ?', [userId], (err, userRows) => {
    if (err) return res.status(500).json({ error: err });
    if (userRows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
    const kelasId = userRows[0].kelas_id;
    db.query('SELECT * FROM jadwal_sesi WHERE kelas_id = ?', [kelasId], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json(results);
    });
  });
};

// Helper: Kirim notifikasi ke mentor
function insertNotifikasiMentor(mentor_id, kelas_id, tanggal, sesi) {
  // Ambil nama kelas
  db.query('SELECT nama FROM kelas WHERE id = ?', [kelas_id], (err, kelasRows) => {
    if (err || !kelasRows.length) return;
    const nama_kelas = kelasRows[0].nama;
    const pesan = `Anda dijadwalkan mengajar di kelas ${nama_kelas} pada ${tanggal} sesi ${sesi}.`;
    db.query('INSERT INTO notifikasi (user_id, pesan) VALUES (?, ?)', [mentor_id, pesan], (err2) => {
      // Tidak perlu handle error di sini, biar silent
    });
  });
} 