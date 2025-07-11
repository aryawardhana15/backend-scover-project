const express = require('express');
const router = express.Router();
const mataPelajaranController = require('../controllers/mataPelajaranController');

router.get('/', mataPelajaranController.getAllMataPelajaran);
router.post('/', mataPelajaranController.createMataPelajaran);

module.exports = router; 