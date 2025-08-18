const express = require('express');
const router = express.Router();
const mentorsController = require('../controllers/mentorsController');
const { requireRole } = require('../middleware');
const { authenticateJWT } = require('../auth');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Public routes
router.post('/', mentorsController.createMentor);
router.post('/login', mentorsController.loginMentor);

// Protected routes
router.get('/', authenticateJWT, mentorsController.getAllMentors);
router.get('/:id/jadwal', authenticateJWT, mentorsController.getJadwalMentor);
router.get('/available', authenticateJWT, mentorsController.getAvailableMentors);
router.get('/:id', authenticateJWT, mentorsController.getMentorById);
router.put('/:id/profile-picture', authenticateJWT, requireRole('mentor'), upload.single('foto_profil'), mentorsController.updateProfilePicture);

module.exports = router;
