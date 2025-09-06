const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { requireRole } = require('../middleware');
const { authenticateJWT } = require('../auth');

// Public routes
router.post('/', usersController.createUser);
router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);

// Protected routes
router.get('/', authenticateJWT, requireRole('admin'), usersController.getAllUsers);
router.get('/:id', authenticateJWT, usersController.getUserById);
router.delete('/:id', authenticateJWT, requireRole('admin'), usersController.deleteUser);

module.exports = router;
