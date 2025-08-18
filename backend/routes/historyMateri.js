const express = require('express');
const router = express.Router();
const historyMateriController = require('../controllers/historyMateriController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, historyMateriController.getAllHistory);
router.post('/', authenticateToken, historyMateriController.createHistory);

router.get('/user/:user_id', authenticateToken, historyMateriController.getHistoryByUserId);

module.exports = router;
