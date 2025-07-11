const express = require('express');
const router = express.Router();
const silabusController = require('../controllers/silabusController');

router.get('/', silabusController.getAllSilabus);
router.post('/', silabusController.createSilabus);

module.exports = router; 