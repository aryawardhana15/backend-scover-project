const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: false
}));

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EduMentor API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      admin: '/api/admin',
      users: '/api/users',
      mentors: '/api/mentors',
      kelas: '/api/kelas',
      'mata-pelajaran': '/api/mata-pelajaran'
    }
  });
});

// Load debug routes first
console.log('🔄 Loading debug routes...');
try {
  const debugRoutes = require('./debug_routes');
  app.use('/api/debug', debugRoutes);
  console.log('✅ Debug routes loaded');
} catch (debugErr) {
  console.error('❌ Debug routes failed:', debugErr.message);
}

// Load all routes
console.log('🔄 Loading main routes...');

try {
  // Load ONLY essential routes to avoid dependency issues
  
  // Admin routes (priority - using minimal controller)
  console.log('🔄 Attempting to load admin routes...');
  try {
    const adminRoutes = require('./routes/admin');
    app.use('/api/admin', adminRoutes);
    console.log('✅ Admin routes loaded (minimal)');
    
    // Verify admin routes are working
    console.log('🔍 Admin routes registered at: /api/admin/*');
  } catch (adminErr) {
    console.error('❌ CRITICAL: Admin routes failed to load!');
    console.error('❌ Error:', adminErr.message);
    console.error('❌ Stack:', adminErr.stack);
    
    // Fallback - create admin login route directly in index.js
    console.log('🔄 Creating fallback admin login route...');
    app.post('/api/admin/login', (req, res) => {
      console.log('🚨 FALLBACK ADMIN LOGIN TRIGGERED');
      try {
        const { email, password } = req.body;
        console.log('📧 Email:', email);
        
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password required' });
        }
        
        // Simple hardcoded admin check
        if (email === 'admin@scover.com' && password === 'admin123') {
          const token = `fallback_admin_${Date.now()}`;
          res.json({
            id: 1,
            email: email,
            role: 'admin',
            token: token,
            fallback: true
          });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } catch (err) {
        console.error('❌ Fallback login error:', err);
        res.status(500).json({ error: 'Fallback login failed' });
      }
    });
    
    console.log('✅ Fallback admin login route created');
  }
  
  // User routes
  const usersRoutes = require('./routes/users');
  app.use('/api/users', usersRoutes);
  console.log('✅ Users routes loaded');
  
  // Try loading other routes with error handling
  try {
    const mentorsRoutes = require('./routes/mentors');
    app.use('/api/mentors', mentorsRoutes);
    console.log('✅ Mentors routes loaded');
  } catch (mentorErr) {
    console.warn('⚠️ Mentors routes failed, skipping:', mentorErr.message);
  }
  
  try {
    const kelasRoutes = require('./routes/kelas');
    app.use('/api/kelas', kelasRoutes);
    console.log('✅ Kelas routes loaded');
  } catch (kelasErr) {
    console.warn('⚠️ Kelas routes failed, skipping:', kelasErr.message);
  }
  
  try {
    const mataPelajaranRoutes = require('./routes/mataPelajaran');
    app.use('/api/mata-pelajaran', mataPelajaranRoutes);
    console.log('✅ Mata Pelajaran routes loaded');
  } catch (mapelErr) {
    console.warn('⚠️ Mata Pelajaran routes failed, skipping:', mapelErr.message);
  }
  
  try {
    const jadwalSesiRoutes = require('./routes/jadwalSesi');
    app.use('/api/jadwal-sesi', jadwalSesiRoutes);
    console.log('✅ Jadwal Sesi routes loaded');
  } catch (jadwalErr) {
    console.warn('⚠️ Jadwal Sesi routes failed, skipping:', jadwalErr.message);
  }
  
  try {
    const permintaanJadwalRoutes = require('./routes/permintaanJadwal');
    app.use('/api/permintaan-jadwal', permintaanJadwalRoutes);
    console.log('✅ Permintaan Jadwal routes loaded');
  } catch (permintaanErr) {
    console.warn('⚠️ Permintaan Jadwal routes failed, skipping:', permintaanErr.message);
  }
  
  try {
    const silabusRoutes = require('./routes/silabus');
    app.use('/api/silabus', silabusRoutes);
    console.log('✅ Silabus routes loaded');
  } catch (silabusErr) {
    console.warn('⚠️ Silabus routes failed, skipping:', silabusErr.message);
  }
  
  try {
    const historyMateriRoutes = require('./routes/historyMateri');
    app.use('/api/history-materi', historyMateriRoutes);
    console.log('✅ History Materi routes loaded');
  } catch (historyErr) {
    console.warn('⚠️ History Materi routes failed, skipping:', historyErr.message);
  }
  
  try {
    const pengumumanRoutes = require('./routes/pengumuman');
    app.use('/api/pengumuman', pengumumanRoutes);
    console.log('✅ Pengumuman routes loaded');
  } catch (pengumumanErr) {
    console.warn('⚠️ Pengumuman routes failed, skipping:', pengumumanErr.message);
  }
  
  try {
    const chatRoutes = require('./routes/chat');
    app.use('/api/chat', chatRoutes);
    console.log('✅ Chat routes loaded');
  } catch (chatErr) {
    console.warn('⚠️ Chat routes failed, skipping:', chatErr.message);
  }
  
} catch (err) {
  console.error('❌ Critical error loading routes:', err.message);
  console.error('Stack:', err.stack);
}

// Add route to debug all registered routes
app.get('/api/routes-debug', (req, res) => {
  const routes = [];
  
  function extractRoutes(stack, basePath = '') {
    stack.forEach(layer => {
      if (layer.route) {
        // Direct route
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        routes.push({
          path: basePath + layer.route.path,
          methods: methods,
          type: 'route'
        });
      } else if (layer.name === 'router' && layer.regexp) {
        // Router middleware
        const routerPath = layer.regexp.source
          .replace(/^\^/, '')
          .replace(/\$$/, '')
          .replace(/\\\//g, '/')
          .replace(/\?\(\?\=/g, '')
          .replace(/\)/g, '');
        
        routes.push({
          path: basePath + routerPath,
          methods: 'ROUTER',
          type: 'middleware'
        });
        
        if (layer.handle && layer.handle.stack) {
          extractRoutes(layer.handle.stack, basePath + routerPath);
        }
      }
    });
  }
  
  try {
    if (req.app._router && req.app._router.stack) {
      extractRoutes(req.app._router.stack);
    }
    
    res.json({
      message: 'All registered routes',
      totalRoutes: routes.length,
      routes: routes.sort((a, b) => a.path.localeCompare(b.path)),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to extract routes',
      message: error.message
    });
  }
});

console.log('✅ Route debugging endpoint created: /api/routes-debug');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.header('Access-Control-Allow-Origin', '*');
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
    message: 'API endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log('\n🚀 ====== EDUMENTOR API STARTED ======');
  console.log(`✅ Server running on port ${PORT}`);
  console.log('🌐 API URL: https://api2.myscover.my.id');
  console.log('🔗 Health Check: https://api2.myscover.my.id/');
  console.log('🔑 Admin Login: https://api2.myscover.my.id/api/admin/login');
  console.log('👥 Users API: https://api2.myscover.my.id/api/users');
  console.log('🎓 Mentors API: https://api2.myscover.my.id/api/mentors');
  console.log('🏫 Kelas API: https://api2.myscover.my.id/api/kelas');
  console.log('📚 Mata Pelajaran API: https://api2.myscover.my.id/api/mata-pelajaran');
  console.log('🚀 ====== READY FOR REQUESTS ======\n');
});
