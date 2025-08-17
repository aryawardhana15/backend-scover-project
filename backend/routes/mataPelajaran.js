const express = require('express');
const router = express.Router();
const mataPelajaranController = require('../controllers/mataPelajaranController');
const { authenticateJWT } = require('../auth');

router.get('/', authenticateJWT, mataPelajaranController.getAllMataPelajaran);
router.post('/', authenticateJWT, mataPelajaranController.createMataPelajaran);

module.exports = router;
