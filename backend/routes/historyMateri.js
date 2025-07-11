const express = require('express');
const router = express.Router();
const historyMateriController = require('../controllers/historyMateriController');

router.get('/', historyMateriController.getAllHistory);
router.post('/', historyMateriController.createHistory);

module.exports = router; 