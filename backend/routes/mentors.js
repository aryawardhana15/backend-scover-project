const express = require('express');
const router = express.Router();
const mentorsController = require('../controllers/mentorsController');

router.get('/', mentorsController.getAllMentors);
router.post('/', mentorsController.createMentor);

module.exports = router; 