const express = require('express');
const router = express.Router();
const mentorsController = require('../controllers/mentorsController');

router.get('/', mentorsController.getAllMentors);
router.post('/', mentorsController.createMentor);
// Tambahkan endpoint login mentor
router.post('/login', mentorsController.loginMentor);

module.exports = router; 