const db = require('../config/db');

exports.getAllHistory = (req, res) => {
  db.query(`
    SELECT 
      hm.*,
      js.tanggal,
      js.sesi,
      k.nama as nama_kelas,
      m.nama as nama_mentor,
      mp.nama as nama_mapel
    FROM history_materi hm
    JOIN jadwal_sesi js ON hm.jadwal_sesi_id = js.id
    JOIN kelas k ON js.kelas_id = k.id
    JOIN mentors m ON js.mentor_id = m.id
    LEFT JOIN mata_pelajaran mp ON js.mata_pelajaran_id = mp.id
    ORDER BY hm.created_at DESC
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.createHistory = (req, res) => {
  const { jadwal_sesi_id, hasil_belajar, materi_diajarkan } = req.body;
  const { id: mentor_id, role } = req.user;

  if (role !== 'mentor') {
    return res.status(403).json({ error: 'Only mentors can create history.' });
  }

  if (!jadwal_sesi_id || !hasil_belajar || !materi_diajarkan) {
    return res.status(400).json({ error: 'jadwal_sesi_id, hasil_belajar, dan materi_diajarkan wajib diisi' });
  }

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message || 'Database connection error' });

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: err.message || 'Transaction error' });
      }

      // 1. Get jadwal_sesi details
      connection.query('SELECT * FROM jadwal_sesi WHERE id = ? AND mentor_id = ?', [jadwal_sesi_id, mentor_id], (err, jadwal) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            res.status(500).json({ error: err.message || 'Error fetching session data' });
          });
        }

        if (jadwal.length === 0) {
          return connection.rollback(() => {
            connection.release();
            res.status(404).json({ error: 'Jadwal sesi not found or you are not the mentor for this session.' });
          });
        }

        const sesi = jadwal[0];

        // 2. Insert into history_materi
        const historyData = {
          jadwal_sesi_id: sesi.id,
          kelas_id: sesi.kelas_id,
          mentor_id: sesi.mentor_id,
          mata_pelajaran_id: sesi.mata_pelajaran_id,
          tanggal: sesi.tanggal,
          hasil_belajar,
          materi_diajarkan,
          created_at: new Date()
        };

        connection.query('INSERT INTO history_materi SET ?', historyData, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ error: err.message || 'Error inserting history data' });
            });
          }

          // 3. Update jadwal_sesi status to 'completed'
          connection.query('UPDATE jadwal_sesi SET status = ? WHERE id = ?', ['completed', jadwal_sesi_id], (err, updateResult) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: err.message || 'Error updating session status' });
              });
            }

            // 4. Insert into user learning history for all users in the class
            connection.query('SELECT id FROM users WHERE kelas_id = ?', [sesi.kelas_id], (err, users) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ error: err.message || 'Error fetching users data' });
                });
              }

              // Create user learning history for each user in the class
              const userHistoryPromises = users.map(user => {
                return new Promise((resolve, reject) => {
                  const userHistoryData = {
                    user_id: user.id,
                    jadwal_sesi_id: sesi.id,
                    kelas_id: sesi.kelas_id,
                    mentor_id: sesi.mentor_id,
                    mata_pelajaran_id: sesi.mata_pelajaran_id,
                    tanggal: sesi.tanggal,
                    materi_diajarkan,
                    hasil_belajar,
                    created_at: new Date()
                  };
                  
                  connection.query('INSERT INTO user_learning_history SET ?', userHistoryData, (err) => {
                    if (err) reject(err.message || 'Error inserting user learning history');
                    else resolve();
                  });
                });
              });

              Promise.all(userHistoryPromises)
                .then(() => {
                  connection.commit(err => {
                                      if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ error: err.message || 'Error committing transaction' });
                    });
                  }
                    connection.release();
                    res.status(201).json({ 
                      id: result.insertId, 
                      ...historyData,
                      message: 'Laporan pembelajaran berhasil disimpan dan status sesi diubah menjadi completed'
                    });
                  });
                })
                .catch(err => {
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ error: err.message || 'Error creating user learning history' });
                  });
                });
            });
          });
        });
      });
    });
  });
};

exports.getHistoryByUserId = (req, res) => {
  const { user_id } = req.params;
  db.query(`
    SELECT 
      uhl.*,
      js.tanggal,
      js.sesi,
      k.nama as nama_kelas,
      m.nama as nama_mentor,
      mp.nama as nama_mapel
    FROM user_learning_history uhl
    JOIN jadwal_sesi js ON uhl.jadwal_sesi_id = js.id
    JOIN kelas k ON js.kelas_id = k.id
    JOIN mentors m ON js.mentor_id = m.id
    LEFT JOIN mata_pelajaran mp ON js.mata_pelajaran_id = mp.id
    WHERE uhl.user_id = ?
    ORDER BY uhl.created_at DESC
  `, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Error fetching user history' });
    res.json(results);
  });
};

// Get history by mentor
exports.getHistoryByMentorId = (req, res) => {
  const { mentor_id } = req.params;
  db.query(`
    SELECT 
      hm.*,
      js.tanggal,
      js.sesi,
      k.nama as nama_kelas,
      mp.nama as nama_mapel
    FROM history_materi hm
    JOIN jadwal_sesi js ON hm.jadwal_sesi_id = js.id
    JOIN kelas k ON js.kelas_id = k.id
    LEFT JOIN mata_pelajaran mp ON js.mata_pelajaran_id = mp.id
    WHERE hm.mentor_id = ?
    ORDER BY hm.created_at DESC
  `, [mentor_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Error fetching mentor history' });
    res.json(results);
  });
};
