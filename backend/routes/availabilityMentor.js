const express = require('express');
const router = express.Router();
const availabilityMentorController = require('../controllers/availabilityMentorController');
const { authenticateJWT } = require('../auth');

// GET: /api/availability-mentor?mentor_id=...&minggu_ke=...
router.get('/', authenticateJWT, availabilityMentorController.getAllAvailability);
// POST: /api/availability-mentor (bulk update per minggu)
router.post('/', authenticateJWT, availabilityMentorController.createOrUpdateAvailability);

module.exports = router;
