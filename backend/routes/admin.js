const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController_minimal');
const { authenticateJWT, requireRole } = require('../auth_minimal');

// Test route for debugging
router.get('/test', (req, res) => {
  res.json({
    message: 'Admin routes working',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Direct login test (bypass controller)
router.post('/test-login', (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🧪 [TEST LOGIN] Email:', email);
    console.log('🧪 [TEST LOGIN] Password:', password ? 'provided' : 'missing');
    
    // Simple test response
    const testToken = `admin_test_${Date.now()}`;
    const response = {
      id: 1,
      email: email,
      role: 'admin',
      token: testToken,
      test: true
    };
    
    console.log('🧪 [TEST LOGIN] Response:', response);
    res.json(response);
  } catch (error) {
    console.error('🧪 [TEST LOGIN] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Public routes
router.post('/', adminController.createAdmin);
router.post('/login', (req, res, next) => {
  console.log('\n🔵 ====== LOGIN REQUEST ======');
  console.log('📍 [LOGIN] Origin:', req.headers.origin);
  console.log('📋 [LOGIN] Headers:', req.headers);
  console.log('📦 [LOGIN] Body:', req.body);
  next();
}, adminController.loginAdmin);

// Protected routes
router.get('/', authenticateJWT, requireRole('admin'), adminController.getAllAdmin);
router.get('/current-week', authenticateJWT, adminController.getCurrentWeek);
router.get('/stats', authenticateJWT, requireRole('admin'), adminController.getStats);

// Routes to get all users and mentors for admin chat
router.get('/users', authenticateJWT, requireRole('admin'), adminController.getAllUsers);
router.get('/mentors', authenticateJWT, requireRole('admin'), adminController.getAllMentors);

module.exports = router;
