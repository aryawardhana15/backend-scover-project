const express = require('express');
const router = express.Router();
const availabilityMentorController = require('../controllers/availabilityMentorController');

// GET: /api/availability-mentor?mentor_id=...&minggu_ke=...
router.get('/', availabilityMentorController.getAllAvailability);
// POST: /api/availability-mentor (bulk update per minggu)
router.post('/', availabilityMentorController.createOrUpdateAvailability);

module.exports = router; 