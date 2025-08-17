const express = require('express');
const router = express.Router();
const permintaanJadwalController = require('../controllers/permintaanJadwalController');
const { requireRole } = require('../middleware');
const { authenticateJWT } = require('../auth');

router.get('/', authenticateJWT, requireRole('admin'), permintaanJadwalController.getAllPermintaan);
router.post('/', authenticateJWT, requireRole('user'), permintaanJadwalController.createPermintaan);
router.get('/user/:user_id', authenticateJWT, permintaanJadwalController.getPermintaanByUser);

router.post('/approve/:id', authenticateJWT, requireRole('admin'), permintaanJadwalController.approvePermintaan);
router.post('/reject/:id', authenticateJWT, requireRole('admin'), permintaanJadwalController.rejectPermintaan);

module.exports = router;
