const db = require('../config/db');

// GET: Semua availability, bisa filter by mentor_id, minggu_ke
exports.getAllAvailability = (req, res) => {
  const { mentor_id, minggu_ke } = req.query;
  let sql = 'SELECT * FROM availability_mentor';
  const params = [];
  if (mentor_id || minggu_ke) {
    sql += ' WHERE ';
    if (mentor_id) {
      sql += 'mentor_id = ?';
      params.push(mentor_id);
    }
    if (minggu_ke) {
      if (params.length) sql += ' AND ';
      sql += 'minggu_ke = ?';
      params.push(minggu_ke);
    }
  }
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('DB ERROR (getAllAvailability):', err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
};

// Helper: cek tabrakan jadwal
function checkConflicts(mentor_id, minggu_ke, data, callback) {
  const hariSesiSet = new Set(data.filter(d => d.is_available).map(d => `${d.hari}_${d.sesi}`));
  db.query(
    `SELECT tanggal, sesi, kelas_id FROM jadwal_sesi WHERE mentor_id = ? AND WEEK(tanggal, 1) = ? AND status IN ('scheduled','pending','approved')`,
    [mentor_id, minggu_ke],
    (err, jadwalRows) => {
      if (err) {
        console.error('DB ERROR (checkConflicts/jadwal_sesi):', err);
        return callback(err);
      }
      db.query(
        `SELECT tanggal, sesi, kelas_id FROM permintaan_jadwal WHERE mentor_id = ? AND status IN ('pending','approved')`,
        [mentor_id],
        (err2, permintaanRows) => {
          if (err2) {
            console.error('DB ERROR (checkConflicts/permintaan_jadwal):', err2);
            return callback(err2);
          }
          const allJadwal = [...jadwalRows, ...permintaanRows];
          const conflicts = [];
          for (const jadwal of allJadwal) {
            const tgl = new Date(jadwal.tanggal);
            const hari = tgl.toLocaleDateString('id-ID', { weekday: 'long' });
            const sesi = jadwal.sesi;
            if (hariSesiSet.has(`${hari}_${sesi}`)) {
              conflicts.push({ tanggal: jadwal.tanggal, sesi, kelas_id: jadwal.kelas_id, type: 'double_booking' });
            }
          }
          const kelasHari = {};
          for (const jadwal of allJadwal) {
            const tgl = new Date(jadwal.tanggal);
            const hari = tgl.toLocaleDateString('id-ID', { weekday: 'long' });
            const key = `${jadwal.kelas_id}_${hari}`;
            if (!kelasHari[key]) kelasHari[key] = 0;
            kelasHari[key]++;
            if (kelasHari[key] > 1) {
              conflicts.push({ tanggal: jadwal.tanggal, sesi: jadwal.sesi, kelas_id: jadwal.kelas_id, type: 'kelas_sama_2x_hari' });
            }
          }
          callback(null, conflicts);
        }
      );
    }
  );
}

// POST: Bulk insert/update availability per minggu
exports.createOrUpdateAvailability = (req, res) => {
  const { mentor_id, minggu_ke, data } = req.body;
  if (!mentor_id || !minggu_ke || !Array.isArray(data)) {
    return res.status(400).json({ error: 'mentor_id, minggu_ke, data[] required' });
  }
  checkConflicts(mentor_id, minggu_ke, data, (err, conflicts) => {
    if (err) {
      console.error('DB ERROR (checkConflicts):', err);
      return res.status(500).json({ error: err });
    }
    if (conflicts && conflicts.length > 0) {
      return res.status(400).json({ error: 'Tabrakan jadwal', conflicts });
    }
    db.query(
      'DELETE FROM availability_mentor WHERE mentor_id = ? AND minggu_ke = ?',
      [mentor_id, minggu_ke],
      (err) => {
        if (err) {
          console.error('DB ERROR (DELETE availability_mentor):', err);
          return res.status(500).json({ error: err });
        }
        if (data.length === 0) return res.json({ success: true, message: 'Availability cleared' });
        const values = data.map(item => [
          mentor_id,
          minggu_ke,
          item.hari,
          item.sesi,
          item.is_available,
          item.reason || null,
          item.kelas_id || null
        ]);
        db.query(
          'INSERT INTO availability_mentor (mentor_id, minggu_ke, hari, sesi, is_available, reason, kelas_id) VALUES ?',
          [values],
          (err2, result) => {
            if (err2) {
              console.error('DB ERROR (INSERT availability_mentor):', err2);
              return res.status(500).json({ error: err2 });
            }
            res.json({ success: true, inserted: result.affectedRows });
          }
        );
      }
    );
  });
}; 