const express = require('express');
const router = express.Router();
const pengumumanController = require('../controllers/pengumumanController');
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

router.get('/', pengumumanController.getAllPengumuman);
router.post('/', authenticateJWT, requireRole('admin'), upload.single('gambar'), pengumumanController.createPengumuman);
router.delete('/:id', authenticateJWT, requireRole('admin'), pengumumanController.deletePengumuman);

module.exports = router;
