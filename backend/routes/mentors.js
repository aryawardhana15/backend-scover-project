const express = require('express');
const router = express.Router();
const mentorsController = require('../controllers/mentorsController');
const { requireRole } = require('../middleware');
const { authenticateJWT } = require('../auth');

// Public routes
router.post('/', mentorsController.createMentor);
router.post('/login', mentorsController.loginMentor);

// Protected routes
router.get('/', authenticateJWT, mentorsController.getAllMentors);
router.get('/:id/jadwal', authenticateJWT, mentorsController.getJadwalMentor);
router.get('/available', authenticateJWT, mentorsController.getAvailableMentors);
router.get('/:id', authenticateJWT, mentorsController.getMentorById);

module.exports = router;
