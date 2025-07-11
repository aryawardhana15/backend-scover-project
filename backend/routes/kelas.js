const express = require('express');
const router = express.Router();
const kelasController = require('../controllers/kelasController');

router.get('/', kelasController.getAllKelas);
router.post('/', kelasController.createKelas);

module.exports = router; 