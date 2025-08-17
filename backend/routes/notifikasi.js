const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/notifikasiController');
const { authenticateJWT } = require('../auth');

router.get('/', authenticateJWT, notifikasiController.getAllNotifikasi);
router.post('/', authenticateJWT, notifikasiController.createNotifikasi);

module.exports = router;
