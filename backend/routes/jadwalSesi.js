const express = require('express');
const router = express.Router();
const jadwalSesiController = require('../controllers/jadwalSesiController');

router.get('/', jadwalSesiController.getAllJadwalSesi);
// POST /: Buat jadwal sesi baru, validasi mentor available, mampu, dan tidak double teaching
router.post('/', jadwalSesiController.createJadwalSesi);
router.get('/user/:user_id', jadwalSesiController.getJadwalByUser);

module.exports = router; 