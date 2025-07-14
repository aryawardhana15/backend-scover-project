const express = require('express');
const router = express.Router();
const mentorsController = require('../controllers/mentorsController');

router.get('/', mentorsController.getAllMentors);
router.post('/', mentorsController.createMentor);
// Tambahkan endpoint login mentor
router.post('/login', mentorsController.loginMentor);
// Endpoint untuk ambil jadwal mengajar mentor
router.get('/:id/jadwal', mentorsController.getJadwalMentor);
// Endpoint untuk ambil mentor yang available pada mapel, tanggal, sesi, kelas tertentu
router.get('/available', mentorsController.getAvailableMentors);

module.exports = router; 