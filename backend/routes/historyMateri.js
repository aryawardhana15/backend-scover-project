const express = require('express');
const router = express.Router();
const historyMateriController = require('../controllers/historyMateriController');
const { authenticateJWT } = require('../auth');

router.get('/', authenticateJWT, historyMateriController.getAllHistory);
router.post('/', authenticateJWT, historyMateriController.createHistory);

router.get('/user/:user_id', authenticateJWT, historyMateriController.getHistoryByUserId);

module.exports = router;
