const express = require('express');
const router = express.Router();
const kelasController = require('../controllers/kelasController');
const { authenticateJWT } = require('../auth');

router.get('/', authenticateJWT, kelasController.getAllKelas);
router.post('/', authenticateJWT, kelasController.createKelas);

module.exports = router;
