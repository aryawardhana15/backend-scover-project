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