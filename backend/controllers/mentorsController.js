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