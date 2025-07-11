const express = require('express');
const router = express.Router();
const jadwalSesiController = require('../controllers/jadwalSesiController');

router.get('/', jadwalSesiController.getAllJadwalSesi);
router.post('/', jadwalSesiController.createJadwalSesi);

module.exports = router; 