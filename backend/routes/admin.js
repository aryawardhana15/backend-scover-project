const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAllAdmin);
router.post('/', adminController.createAdmin);

module.exports = router; 