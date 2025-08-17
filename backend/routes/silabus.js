const express = require('express');
const router = express.Router();
const silabusController = require('../controllers/silabusController');
const { authenticateJWT } = require('../auth');

router.get('/', authenticateJWT, silabusController.getAllSilabus);
router.post('/', authenticateJWT, silabusController.createSilabus);

module.exports = router;
