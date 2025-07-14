const db = require('../config/db');

exports.getAllJadwalSesi = (req, res) => {
  db.query('SELECT * FROM jadwal_sesi', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createJadwalSesi = (req, res) => {
  const { kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status, mata_pelajaran_id } = req.body;
  // 1. Cek kemampuan
  db.query('SELECT 1 FROM mentor_mata_pelajaran WHERE mentor_id = ? AND mata_pelajaran_id = ?', [mentor_id, mata_pelajaran_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (rows.length === 0) return res.status(400).json({ error: 'Mentor tidak punya kemampuan mengajar mapel ini' });
    // 2. Cek availability
    const hari = new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long' });
    db.query('SELECT 1 FROM availability_mentor WHERE mentor_id = ? AND minggu_ke = ? AND hari = ? AND sesi = ? AND is_available = 1', [mentor_id, getWeekNumber(new Date(tanggal)), hari, sesi], (err2, rows2) => {
      if (err2) return res.status(500).json({ error: err2 });
      if (rows2.length === 0) return res.status(400).json({ error: 'Mentor tidak available di waktu ini' });
      // 3. Cek double teaching
      db.query('SELECT 1 FROM jadwal_sesi WHERE mentor_id = ? AND tanggal = ? AND sesi = ?', [mentor_id, tanggal, sesi], (err3, rows3) => {
        if (err3) return res.status(500).json({ error: err3 });
        if (rows3.length > 0) return res.status(400).json({ error: 'Mentor sudah mengajar di sesi ini pada hari tersebut' });
        // 4. Insert jadwal
        db.query(
          'INSERT INTO jadwal_sesi (kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status],
          (err4, result) => {
            if (err4) return res.status(500).json({ error: err4 });
            // Kirim notifikasi ke mentor
            insertNotifikasiMentor(mentor_id, kelas_id, tanggal, sesi);
            res.json({ id: result.insertId, kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status });
          }
        );
      });
    });
  });
};

// Helper: get week number
function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

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