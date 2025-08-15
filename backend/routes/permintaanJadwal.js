const express = require('express');
const router = express.Router();
const permintaanJadwalController = require('../controllers/permintaanJadwalController');
const { requireRole } = require('../middleware');

router.get('/', requireRole('admin'), permintaanJadwalController.getAllPermintaan);
router.post('/', requireRole('user'), permintaanJadwalController.createPermintaan);
router.get('/user/:user_id', permintaanJadwalController.getPermintaanByUser);

module.exports = router; 