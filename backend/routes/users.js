const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { requireRole } = require('../middleware');

router.get('/', requireRole('admin'), usersController.getAllUsers);
router.post('/', usersController.createUser);
router.post('/login', usersController.loginUser);

module.exports = router; 