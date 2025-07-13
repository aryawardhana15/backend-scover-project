const express = require('express');
const router = express.Router();
const controller = require('../controllers/mentorMataPelajaranController');

router.get('/by-mentor', controller.getByMentor);
router.get('/by-mapel', controller.getByMapel);
router.post('/', controller.assign);
router.delete('/:id', controller.remove);

module.exports = router; 