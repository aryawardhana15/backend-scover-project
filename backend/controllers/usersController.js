const db = require('../config/db');
const { generateToken } = require('../auth');

exports.getAllUsers = (req, res) => {
  db.query('SELECT id, nama, email, foto_profil FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const { nama, email, password, foto_profil } = req.body;
  db.query('INSERT INTO users (nama, email, password, foto_profil) VALUES (?, ?, ?, ?)', [nama, email, password, foto_profil], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ id: result.insertId, nama, email, foto_profil });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT id, email, nama, kelas_id FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (results.length === 0) return res.status(401).json({ error: 'Login gagal' });
    const user = { id: results[0].id, email: results[0].email, nama: results[0].nama, kelas_id: results[0].kelas_id, role: 'user' };
    const token = generateToken(user);
    res.json({ ...user, token });
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, nama, email, foto_profil FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ message: 'User deleted successfully' });
  });
};
