const express = require('express');
const router = express.Router();
const availabilityMentorController = require('../controllers/availabilityMentorController');

router.get('/', availabilityMentorController.getAllAvailability);
router.post('/', availabilityMentorController.createAvailability);

module.exports = router; 