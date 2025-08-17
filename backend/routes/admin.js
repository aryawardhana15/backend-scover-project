const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireRole } = require('../middleware');
const { authenticateJWT } = require('../auth');

// Public routes
router.post('/', adminController.createAdmin);
router.post('/login', adminController.loginAdmin);

// Protected routes
router.get('/', authenticateJWT, requireRole('admin'), adminController.getAllAdmin);
router.get('/current-week', authenticateJWT, adminController.getCurrentWeek);
router.get('/stats', authenticateJWT, requireRole('admin'), adminController.getStats);

module.exports = router;
