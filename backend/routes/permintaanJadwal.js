const express = require('express');
const router = express.Router();
const permintaanJadwalController = require('../controllers/permintaanJadwalController');

router.get('/', permintaanJadwalController.getAllPermintaan);
router.post('/', permintaanJadwalController.createPermintaan);

module.exports = router; 