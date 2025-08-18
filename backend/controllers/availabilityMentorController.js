const db = require('../config/db');
const { getHariFromDate } = require('../utils/dateUtils');

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
      return res.status(500).json({ error: err.message || 'Database error occurred' });
    }
    res.json(results);
  });
};

// Helper: cek tabrakan jadwal dengan logika yang lebih baik
function checkConflicts(mentor_id, minggu_ke, data, callback) {
  const hariSesiSet = new Set(data.filter(d => d.is_available).map(d => `${d.hari}_${d.sesi}`));
  
  // Jika tidak ada availability yang dipilih, tidak ada konflik
  if (hariSesiSet.size === 0) {
    return callback(null, []);
  }

  // Hitung tanggal awal dan akhir minggu
  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfWeek = new Date(startOfYear);
  startOfWeek.setDate(startOfYear.getDate() + (minggu_ke - 1) * 7);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  db.query(
    `SELECT tanggal, sesi, kelas_id, status FROM jadwal_sesi 
     WHERE mentor_id = ? 
     AND tanggal BETWEEN ? AND ? 
     AND status IN ('scheduled','pending','approved','completed')`,
    [mentor_id, startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]],
    (err, jadwalRows) => {
      if (err) {
        console.error('DB ERROR (checkConflicts/jadwal_sesi):', err);
        return callback(err);
      }

      db.query(
        `SELECT tanggal, sesi, kelas_id, status FROM permintaan_jadwal 
         WHERE mentor_id = ? 
         AND tanggal BETWEEN ? AND ? 
         AND status IN ('pending','approved')`,
        [mentor_id, startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]],
        (err2, permintaanRows) => {
          if (err2) {
            console.error('DB ERROR (checkConflicts/permintaan_jadwal):', err2);
            return callback(err2);
          }

          const allJadwal = [...jadwalRows, ...permintaanRows];
          const conflicts = [];

          // Cek konflik dengan jadwal yang sudah ada
          for (const jadwal of allJadwal) {
            const tgl = new Date(jadwal.tanggal);
            const hari = getHariFromDate(tgl);
            const sesi = jadwal.sesi;
            const hariSesiKey = `${hari}_${sesi}`;
            
            if (hariSesiSet.has(hariSesiKey)) {
              conflicts.push({ 
                tanggal: jadwal.tanggal, 
                sesi, 
                kelas_id: jadwal.kelas_id, 
                type: 'jadwal_sudah_ada',
                message: `Sudah ada jadwal di ${hari} sesi ${sesi} untuk kelas ${jadwal.kelas_id}`
              });
            }
          }

          // Cek konflik antar kelas dalam hari yang sama
          const kelasHari = {};
          for (const jadwal of allJadwal) {
            const tgl = new Date(jadwal.tanggal);
            const hari = getHariFromDate(tgl);
            const key = `${jadwal.kelas_id}_${hari}`;
            if (!kelasHari[key]) kelasHari[key] = [];
            kelasHari[key].push(jadwal.sesi);
          }

          // Cek apakah ada kelas yang dijadwalkan lebih dari 1x dalam hari yang sama
          for (const [key, sesiList] of Object.entries(kelasHari)) {
            if (sesiList.length > 1) {
              const [kelas_id, hari] = key.split('_');
              conflicts.push({ 
                tanggal: null, 
                sesi: sesiList.join(', '), 
                kelas_id, 
                type: 'kelas_sama_2x_hari',
                message: `Kelas ${kelas_id} sudah dijadwalkan ${sesiList.length}x di hari ${hari}`
              });
            }
          }

          // Cek apakah mentor mencoba mengajar di waktu yang sama untuk kelas berbeda
          const mentorHariSesi = {};
          for (const jadwal of allJadwal) {
            const tgl = new Date(jadwal.tanggal);
            const hari = getHariFromDate(tgl);
            const sesi = jadwal.sesi;
            const key = `${hari}_${sesi}`;
            
            if (!mentorHariSesi[key]) mentorHariSesi[key] = [];
            mentorHariSesi[key].push(jadwal.kelas_id);
          }

          for (const [key, kelasList] of Object.entries(mentorHariSesi)) {
            if (kelasList.length > 1) {
              const [hari, sesi] = key.split('_');
              conflicts.push({ 
                tanggal: null, 
                sesi, 
                kelas_id: kelasList.join(', '), 
                type: 'mentor_double_booking',
                message: `Mentor mencoba mengajar di ${hari} sesi ${sesi} untuk ${kelasList.length} kelas berbeda`
              });
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
      return res.status(500).json({ error: err.message || 'Database error occurred' });
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
          return res.status(500).json({ error: err.message || 'Database error occurred' });
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
              return res.status(500).json({ error: err2.message || 'Database error occurred' });
            }
            res.json({ success: true, inserted: result.affectedRows });
          }
        );
      }
    );
  });
}; 