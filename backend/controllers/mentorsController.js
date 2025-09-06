const db = require('../config/db');
const { getWeekNumber, getHariFromDate } = require('../utils/dateUtils');
const { generateToken } = require('../auth');

exports.getAllMentors = (req, res) => {
  db.query('SELECT id, nama, email, foto_profil FROM mentors', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.updateProfilePicture = (req, res) => {
  const { id } = req.params;
  const mentorIdFromToken = req.user.id;

  // Pastikan mentor hanya bisa mengubah foto profilnya sendiri
  if (parseInt(id, 10) !== mentorIdFromToken) {
    return res.status(403).json({ error: 'Forbidden: You can only update your own profile picture.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const foto_profil = req.file.path.replace(/\\/g, "/");

  db.query('UPDATE mentors SET foto_profil = ? WHERE id = ?', [foto_profil, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Mentor not found' });

    db.query('SELECT id, nama, email, foto_profil FROM mentors WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
      res.json(results[0]);
    });
  });
};

exports.createMentor = (req, res) => {
  const { nama, email, password, foto_profil } = req.body;
  db.query('INSERT INTO mentors (nama, email, password, foto_profil) VALUES (?, ?, ?, ?)', [nama, email, password, foto_profil], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ id: result.insertId, nama, email, foto_profil });
  });
};

exports.registerMentor = (req, res) => {
  const { nama, email, password } = req.body;
  
  // Check if mentor already exists
  db.query('SELECT id FROM mentors WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (results.length > 0) return res.status(400).json({ error: 'Email sudah terdaftar' });
    
    // Insert new mentor
    db.query('INSERT INTO mentors (nama, email, password) VALUES (?, ?, ?)', [nama, email, password], (err, result) => {
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
      res.json({ 
        message: 'Registrasi mentor berhasil', 
        user: { id: result.insertId, nama, email, role: 'mentor' } 
      });
    });
  });
};

// Tambahkan endpoint login mentor
exports.loginMentor = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT id, email, nama FROM mentors WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (results.length === 0) return res.status(401).json({ error: 'Login gagal' });
    const user = { id: results[0].id, email: results[0].email, nama: results[0].nama, role: 'mentor' };
    const token = generateToken(user);
    res.json({ ...user, token });
  });
};

exports.getMentorById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, nama, email, foto_profil FROM mentors WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (results.length === 0) return res.status(404).json({ error: 'Mentor not found' });
    res.json(results[0]);
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
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
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
  
  // Ambil hari dari tanggal dengan perhitungan yang benar
  const date = new Date(tanggal);
  const hari = getHariFromDate(date);
  
  // Hitung minggu ke berapa dari tanggal
  const mingguKe = getWeekNumber(date);
  
  // Debug log
  console.log('DEBUG getAvailableMentors:');
  console.log('Tanggal:', tanggal);
  console.log('Hari:', hari);
  console.log('Minggu ke:', mingguKe);
  console.log('Sesi:', sesi);
  console.log('Mapel ID:', mapel_id);
  
  // 1. Mentor harus bisa mapel tsb
  // 2. Mentor available di hari/sesi tsb pada minggu yang sesuai
  // 3. Tidak ada jadwal tabrakan di jadwal_sesi pada tanggal & sesi tsb
  // 4. Tidak sedang mengajar kelas lain di waktu tsb
  const sql = `
    SELECT DISTINCT m.id, m.nama, m.email
    FROM mentors m
    JOIN mentor_mata_pelajaran mmp ON m.id = mmp.mentor_id
    LEFT JOIN availability_mentor am ON m.id = am.mentor_id 
      AND am.hari = ? 
      AND am.sesi = ? 
      AND am.minggu_ke = ?
      AND am.is_available = 1
    WHERE mmp.mata_pelajaran_id = ?
      AND am.id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM jadwal_sesi js
        WHERE js.mentor_id = m.id AND js.tanggal = ? AND js.sesi = ?
      )
  `;
  
  console.log('SQL params:', [hari, sesi, mingguKe, mapel_id, tanggal, sesi]);
  
  db.query(sql, [hari, sesi, mingguKe, mapel_id, tanggal, sesi], (err, results) => {
    if (err) {
      console.error('DB ERROR:', err);
      return res.status(500).json({ error: err.message || 'Database error occurred' });
    }
    console.log('Query results:', results);
    res.json(results);
  });
};
