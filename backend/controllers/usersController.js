const db = require('../config/db');
const { generateToken } = require('../auth');

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const { nama, email, password } = req.body;
  db.query('INSERT INTO users (nama, email, password) VALUES (?, ?, ?)', [nama, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, nama, email });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT id, email FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ error: 'Login gagal' });
    const user = { id: results[0].id, email: results[0].email, role: 'user' };
    const token = generateToken(user);
    res.json({ ...user, token });
  });
}; 