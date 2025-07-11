const db = require('../config/db');

exports.getAllAvailability = (req, res) => {
  db.query('SELECT * FROM availability_mentor', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createAvailability = (req, res) => {
  const { mentor_id, hari, sesi, available } = req.body;
  db.query(
    'INSERT INTO availability_mentor (mentor_id, hari, sesi, available) VALUES (?, ?, ?, ?)',
    [mentor_id, hari, sesi, available],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, mentor_id, hari, sesi, available });
    }
  );
}; 