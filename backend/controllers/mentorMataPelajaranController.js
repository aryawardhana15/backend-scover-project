const db = require('../config/db');

// Get all mapel yang bisa diajar oleh mentor tertentu
exports.getByMentor = (req, res) => {
  const { mentor_id } = req.query;
  db.query(
    `SELECT mmp.id, mmp.mentor_id, mmp.mata_pelajaran_id, mp.nama as nama_mapel
     FROM mentor_mata_pelajaran mmp
     JOIN mata_pelajaran mp ON mmp.mata_pelajaran_id = mp.id
     WHERE mmp.mentor_id = ?`,
    [mentor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};

// Get all mentor yang bisa mengajar mapel tertentu
exports.getByMapel = (req, res) => {
  const { mapel_id } = req.query;
  db.query(
    `SELECT mmp.id, mmp.mentor_id, m.nama as nama_mentor, mmp.mata_pelajaran_id
     FROM mentor_mata_pelajaran mmp
     JOIN mentors m ON mmp.mentor_id = m.id
     WHERE mmp.mata_pelajaran_id = ?`,
    [mapel_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};

// Assign mentor ke mapel
exports.assign = (req, res) => {
  const { mentor_id, mata_pelajaran_id } = req.body;
  db.query(
    'INSERT INTO mentor_mata_pelajaran (mentor_id, mata_pelajaran_id) VALUES (?, ?)',
    [mentor_id, mata_pelajaran_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, mentor_id, mata_pelajaran_id });
    }
  );
};

// Hapus kemampuan mengajar
exports.remove = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM mentor_mata_pelajaran WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
}; 