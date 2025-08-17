const express = require('express');
const router = express.Router();
const jadwalSesiController = require('../controllers/jadwalSesiController');
const { authenticateJWT } = require('../auth');

router.get('/', authenticateJWT, jadwalSesiController.getAllJadwalSesi);
// POST /: Buat jadwal sesi baru, validasi mentor available, mampu, dan tidak double teaching
router.post('/', authenticateJWT, jadwalSesiController.createJadwalSesi);
router.get('/user/:user_id', authenticateJWT, jadwalSesiController.getJadwalByUser);

module.exports = router;
