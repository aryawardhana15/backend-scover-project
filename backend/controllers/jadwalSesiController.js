const db = require('../config/db');
const { getWeekNumber, getHariFromDate } = require('../utils/dateUtils');

exports.getAllJadwalSesi = (req, res) => {
  db.query('SELECT * FROM jadwal_sesi', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

// Get jadwal sesi with stats
exports.getJadwalSesiWithStats = (req, res) => {
  db.query(`
    SELECT 
      js.*,
      k.nama as nama_kelas,
      m.nama as nama_mentor,
      mp.nama as nama_mapel,
      CASE 
        WHEN js.tanggal < CURDATE() THEN 'done'
        WHEN js.tanggal = CURDATE() AND js.status = 'completed' THEN 'done'
        ELSE js.status
      END as display_status
    FROM jadwal_sesi js
    JOIN kelas k ON js.kelas_id = k.id
    JOIN mentors m ON js.mentor_id = m.id
    LEFT JOIN mata_pelajaran mp ON js.mata_pelajaran_id = mp.id
    ORDER BY js.tanggal DESC, js.sesi ASC
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Error fetching session data' });
    res.json(results);
  });
};

// Get stats for admin dashboard
exports.getAdminStats = (req, res) => {
  db.query(`
    SELECT 
      COUNT(*) as total_sessions,
      SUM(CASE WHEN tanggal < CURDATE() OR (tanggal = CURDATE() AND status = 'completed') THEN 1 ELSE 0 END) as completed_sessions,
      SUM(CASE WHEN tanggal >= CURDATE() AND status IN ('scheduled', 'approved') THEN 1 ELSE 0 END) as upcoming_sessions,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_sessions
    FROM jadwal_sesi
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Error fetching admin stats' });
    res.json(results[0]);
  });
};

// Get stats for mentor dashboard
exports.getMentorStats = (req, res) => {
  const mentor_id = req.user.id;
  
  db.query(`
    SELECT 
      COUNT(*) as total_sessions,
      SUM(CASE WHEN tanggal < CURDATE() OR (tanggal = CURDATE() AND status = 'completed') THEN 1 ELSE 0 END) as completed_sessions,
      SUM(CASE WHEN tanggal >= CURDATE() AND status IN ('scheduled', 'approved') THEN 1 ELSE 0 END) as upcoming_sessions,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_sessions
    FROM jadwal_sesi
    WHERE mentor_id = ?
  `, [mentor_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Error fetching mentor stats' });
    res.json(results[0]);
  });
};

// Mark session as completed
exports.markSessionCompleted = (req, res) => {
  const { id } = req.params;
  const mentor_id = req.user.id;
  
  db.query(
    'UPDATE jadwal_sesi SET status = ? WHERE id = ? AND mentor_id = ?',
    ['completed', id, mentor_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message || 'Error updating session status' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Session not found or you are not the mentor' });
      }
      res.json({ message: 'Session marked as completed' });
    }
  );
};

exports.createJadwalSesi = (req, res) => {
  console.log('REQ BODY:', req.body);
  const { kelas_id, mentor_id, tanggal, sesi, status, mata_pelajaran_id } = req.body;

  const sesiTimes = {
    1: { jam_mulai: '09:00', jam_selesai: '10:30' },
    2: { jam_mulai: '10:45', jam_selesai: '12:15' },
    3: { jam_mulai: '13:00', jam_selesai: '14:30' },
    4: { jam_mulai: '16:00', jam_selesai: '17:30' },
    5: { jam_mulai: '18:00', jam_selesai: '19:30' },
  };

  const { jam_mulai, jam_selesai } = sesiTimes[sesi] || { jam_mulai: null, jam_selesai: null };

  if (!jam_mulai || !jam_selesai) {
    return res.status(400).json({ error: 'Sesi tidak valid' });
  }

  // 1. Cek kemampuan
  db.query('SELECT 1 FROM mentor_mata_pelajaran WHERE mentor_id = ? AND mata_pelajaran_id = ?', [mentor_id, mata_pelajaran_id], (err, rows) => {
    if (err) {
      console.error('DB ERROR (cek kemampuan):', err);
      return res.status(500).json({ error: err.message || 'Error checking mentor capability' });
    }
    if (rows.length === 0) return res.status(400).json({ error: 'Mentor tidak punya kemampuan mengajar mapel ini' });
    // 2. Cek availability
    const date = new Date(tanggal);
    const hari = getHariFromDate(date);
    db.query('SELECT 1 FROM availability_mentor WHERE mentor_id = ? AND minggu_ke = ? AND hari = ? AND sesi = ? AND is_available = 1', [mentor_id, getWeekNumber(date), hari, sesi], (err2, rows2) => {
      if (err2) {
        console.error('DB ERROR (cek availability):', err2);
        return res.status(500).json({ error: err2.message || 'Error checking mentor availability' });
      }
      if (rows2.length === 0) return res.status(400).json({ error: 'Mentor tidak available di waktu ini' });
      // 3. Cek double teaching
      db.query('SELECT 1 FROM jadwal_sesi WHERE mentor_id = ? AND tanggal = ? AND sesi = ?', [mentor_id, tanggal, sesi], (err3, rows3) => {
        if (err3) {
          console.error('DB ERROR (cek double teaching):', err3);
          return res.status(500).json({ error: err3.message || 'Error checking double teaching' });
        }
        if (rows3.length > 0) return res.status(400).json({ error: 'Mentor sudah mengajar di sesi ini pada hari tersebut' });
        // 4. Insert jadwal
        db.query(
          'INSERT INTO jadwal_sesi (kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [kelas_id, mentor_id, tanggal, sesi, jam_mulai, jam_selesai, status],
          (err4, result) => {
            if (err4) {
              console.error('DB ERROR (insert jadwal):', err4);
              return res.status(500).json({ error: err4.message || 'Error creating session schedule' });
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
    if (err) return res.status(500).json({ error: err.message || 'Error fetching user data' });
    if (userRows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
    const kelasId = userRows[0].kelas_id;
    db.query('SELECT * FROM jadwal_sesi WHERE kelas_id = ?', [kelasId], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message || 'Error fetching session data' });
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
