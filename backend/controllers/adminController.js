const db = require('../config/db');
const { generateToken } = require('../auth');
const { getWeekNumber } = require('../utils/dateUtils');

exports.getAllAdmin = (req, res) => {
  db.query('SELECT * FROM admin', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT id, email FROM admin WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (results.length === 0) return res.status(401).json({ error: 'Login gagal' });
    const user = { id: results[0].id, email: results[0].email, role: 'admin' };
    const token = generateToken(user);
    res.json({ ...user, token });
  });
};

exports.createAdmin = (req, res) => {
  const { nama, email, password } = req.body;
  db.query('INSERT INTO admin (nama, email, password) VALUES (?, ?, ?)', [nama, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ id: result.insertId, nama, email });
  });
};

exports.getCurrentWeek = (req, res) => {
  const today = new Date();
  const weekNumber = getWeekNumber(today);
  res.json({ weekNumber });
};

exports.getStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users) AS total_user,
      (SELECT COUNT(*) FROM mentors) AS total_mentor,
      (SELECT COUNT(*) FROM kelas) AS total_kelas,
      (SELECT COUNT(*) FROM jadwal_sesi WHERE status = 'scheduled') AS total_sesi_scheduled,
      (SELECT COUNT(*) FROM permintaan_jadwal WHERE status = 'pending') AS total_permintaan_pending,
      (SELECT COUNT(*) FROM mata_pelajaran) AS total_mapel;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results[0]);
  });
};

exports.getAllUsers = (req, res) => {
  db.query('SELECT id, nama, email FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.getAllMentors = (req, res) => {
  db.query('SELECT id, nama, email FROM mentors', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};
