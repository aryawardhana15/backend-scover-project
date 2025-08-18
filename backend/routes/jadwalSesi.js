const express = require('express');
const router = express.Router();
const jadwalSesiController = require('../controllers/jadwalSesiController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all jadwal sesi
router.get('/', jadwalSesiController.getAllJadwalSesi);

// Get jadwal sesi with stats
router.get('/with-stats', jadwalSesiController.getJadwalSesiWithStats);

// Get admin stats
router.get('/admin-stats', authenticateToken, requireRole('admin'), jadwalSesiController.getAdminStats);

// Get mentor stats
router.get('/mentor-stats', authenticateToken, jadwalSesiController.getMentorStats);

// Create jadwal sesi
router.post('/', jadwalSesiController.createJadwalSesi);

// Get jadwal by user
router.get('/user/:user_id', jadwalSesiController.getJadwalByUser);

// Mark session as completed
router.put('/:id/complete', authenticateToken, jadwalSesiController.markSessionCompleted);

module.exports = router;
