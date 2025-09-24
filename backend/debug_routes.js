const express = require('express');
const router = express.Router();

// Debug endpoint untuk test konektivitas
router.get('/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
    server: 'api2.myscover.my.id',
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'not set'
  });
});

// Test admin login langsung tanpa controller
router.post('/debug-admin-login', (req, res) => {
  console.log('\n🔥 ====== DEBUG ADMIN LOGIN ======');
  console.log('📧 Email:', req.body.email);
  console.log('🔒 Password provided:', !!req.body.password);
  
  // Hardcoded response untuk test
  const response = {
    id: 1,
    email: req.body.email || 'test@admin.com',
    role: 'admin',
    token: `debug_admin_${Date.now()}`,
    debug: true,
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 Sending debug response:', response);
  res.json(response);
});

// List all available routes
router.get('/routes', (req, res) => {
  const routes = [];
  
  // Get all routes from express app
  function extractRoutes(stack, prefix = '') {
    stack.forEach(layer => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods);
        routes.push({
          path: prefix + layer.route.path,
          methods: methods
        });
      } else if (layer.name === 'router') {
        const routerPrefix = prefix + (layer.regexp.source.match(/^\^\\?\/?(.+?)\\\?\?\$$/) || ['', ''])[1];
        extractRoutes(layer.handle.stack, routerPrefix);
      }
    });
  }
  
  try {
    extractRoutes(req.app._router.stack);
    res.json({
      totalRoutes: routes.length,
      routes: routes
    });
  } catch (error) {
    res.json({
      error: 'Could not extract routes',
      message: error.message
    });
  }
});

module.exports = router;
