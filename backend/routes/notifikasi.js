const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/notifikasiController');

router.get('/', notifikasiController.getAllNotifikasi);
router.post('/', notifikasiController.createNotifikasi);

module.exports = router; 