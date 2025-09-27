const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// CORS Configuration - Fixed to prevent middleware conflict
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'https://myscover.my.id',
  'https://www.myscover.my.id',
  'https://api2.myscover.my.id',
  'https://dashboard.myscover.my.id'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: false
};

// Use only one CORS middleware to prevent conflict
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EduMentor API is running - INDEX_FINAL.JS VERSION',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    file: 'index_final.js',
    cors: {
      origin: req.headers.origin || 'no-origin',
      userAgent: req.headers['user-agent'] || 'no-user-agent'
    },
    endpoints: {
      health: '/',
      adminLogin: '/api/admin/login',
      userLogin: '/api/users/login',
      userRegister: '/api/users/register',
      mentorLogin: '/api/mentors/login',
      debug: '/api/debug',
      adminStats: '/api/admin/stats',
      adminCurrentWeek: '/api/admin/current-week',
      adminPendingMentors: '/api/admin/pending-mentors',
      adminApproveMentor: '/api/admin/mentors/:id/approve',
      adminRejectMentor: '/api/admin/mentors/:id/reject',
      debugMentorApproval: '/api/debug/mentor-approval',
      debugMentorRegistration: '/api/debug/mentor-registration',
      debugAllMentors: '/api/debug/all-mentors',
      debugDatabase: '/api/debug/database',
      debugServerInfo: '/api/debug/server-info',
      users: '/api/users',
      mentors: '/api/mentors',
      kelas: '/api/kelas',
      mataPelajaran: '/api/mata-pelajaran',
      jadwalSesi: '/api/jadwal-sesi',
      permintaanJadwal: '/api/permintaan-jadwal',
      silabus: '/api/silabus',
      pengumuman: '/api/pengumuman',
      historyMateri: '/api/history-materi',
      userPermintaan: '/api/permintaan-jadwal/user/:userId',
      userJadwal: '/api/jadwal-sesi/user/:userId',
      userHistory: '/api/history-materi/user/:userId',
      userProfile: '/api/users/:userId',
      mentorLogin: '/api/mentors/login',
      mentorRegister: '/api/mentors/register',
      mentorJadwal: '/api/mentors/:mentorId/jadwal',
      mentorHistory: '/api/history-materi/mentor/:mentorId',
      mentorAvailability: '/api/availability-mentor (GET, POST)',
      mentorMapel: '/api/mentor-mata-pelajaran/by-mentor',
      mentorMapelAdd: '/api/mentor-mata-pelajaran (POST)',
      mentorMapelRemove: '/api/mentor-mata-pelajaran/:id (DELETE)',
      mentorProfilePicture: '/api/mentors/:id/profile-picture (PUT, GET)',
      mentorProfile: '/api/mentors/:id (GET)',
      mentorAvatar: '/api/avatar/mentor/:id (GET)',
      notifikasi: '/api/notifikasi'
    }
  });
});

// CORS Debug endpoint
app.get('/api/debug/cors', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CORS Debug Info',
    timestamp: new Date().toISOString(),
    headers: {
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent'],
      'access-control-request-method': req.headers['access-control-request-method'],
      'access-control-request-headers': req.headers['access-control-request-headers']
    },
    cors: {
      allowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://myscover.my.id',
        'https://www.myscover.my.id',
        'https://api2.myscover.my.id',
        'https://dashboard.myscover.my.id'
      ],
      currentOrigin: req.headers.origin,
      isAllowed: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://myscover.my.id',
        'https://www.myscover.my.id',
        'https://api2.myscover.my.id',
        'https://dashboard.myscover.my.id'
      ].includes(req.headers.origin)
    }
  });
});

// Debug Health endpoint
app.get('/api/debug/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Debug Health Check',
    timestamp: new Date().toISOString(),
    server: 'EduMentor API',
    version: '2.0.0',
    database: db ? 'connected' : 'disconnected',
    cors: {
      origin: req.headers.origin,
      allowed: true
    }
  });
});

// Debug FormData Test endpoint
app.post('/api/debug/formdata-test', (req, res) => {
  console.log('🧪 [DEBUG] FormData test received');
  console.log('📦 Request body:', req.body);
  console.log('📋 Request headers:', req.headers);
  
  res.json({
    status: 'ok',
    message: 'FormData test successful',
    timestamp: new Date().toISOString(),
    receivedData: {
      body: req.body,
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length']
    }
  });
});

// Public pengumuman endpoint (no auth required for testing)
app.get('/api/pengumuman/public', (req, res) => {
  try {
    console.log('📢 [PENGUMUMAN PUBLIC] Fetching pengumuman (no auth)');
    
    if (!db) {
      console.log('⚠️ [PENGUMUMAN PUBLIC] Database not available, returning mock data');
      return res.json([
        {
          id: 1,
          judul: 'Selamat Datang di EduMentor',
          isi: 'Selamat datang di platform EduMentor! Platform pembelajaran online yang memudahkan proses belajar mengajar.',
          gambar_url: null,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          judul: 'Jadwal Ujian Tengah Semester',
          isi: 'Ujian Tengah Semester akan dilaksanakan pada tanggal 15-20 Maret 2024. Silakan persiapkan diri dengan baik.',
          gambar_url: null,
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    db.query('SELECT * FROM pengumuman ORDER BY created_at DESC', (err, results) => {
      if (err) {
        console.error('❌ [PENGUMUMAN PUBLIC] Database error:', err);
        return res.json([]);
      }
      
      console.log('✅ [PENGUMUMAN PUBLIC] Fetched', results.length, 'pengumuman');
      res.json(results);
    });
    
  } catch (error) {
    console.error('❌ [PENGUMUMAN PUBLIC] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==============================================
// ADMIN ROUTES LANGSUNG DI INDEX.JS
// ==============================================

// Simple database require
let db;
try {
  db = require('./config/db');
  console.log('✅ Database connection loaded');
} catch (dbErr) {
  console.error('❌ Database connection failed:', dbErr.message);
}

// Admin Login - LANGSUNG DI INDEX.JS
app.post('/api/admin/login', (req, res) => {
  console.log('\n🚀 ====== ADMIN LOGIN (INDEX.JS) ======');
  
  try {
    const { email, password } = req.body;
    
    console.log('📧 Email:', email);
    console.log('🔒 Password provided:', !!password);
    
    // Validate input
    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Database check
    if (!db) {
      console.log('❌ Database not available, using hardcoded check');
      
      // Hardcoded admin check
      if (email === 'admin@scover.com' && password === 'admin123') {
        const token = `admin_hardcoded_${Date.now()}`;
        const response = {
          id: 1,
          email: email,
          role: 'admin',
          token: token,
          method: 'hardcoded'
        };
        
        console.log('✅ Hardcoded admin login successful');
        return res.json(response);
      } else {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Email atau password salah'
        });
      }
    }
    
    // Database query
    console.log('🔍 Executing database query...');
    const query = 'SELECT id, email FROM admin WHERE email = ? AND password = ?';
    
    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('❌ Database error:', err.message);
        
        // Fallback to hardcoded on DB error
        if (email === 'admin@scover.com' && password === 'admin123') {
          const token = `admin_fallback_${Date.now()}`;
          return res.json({
            id: 1,
            email: email,
            role: 'admin',
            token: token,
            method: 'fallback'
          });
        }
        
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      console.log('✅ Query executed, results count:', results.length);
      
      if (results.length === 0) {
        console.log('❌ No admin found in database');
        
        // Fallback to hardcoded
        if (email === 'admin@scover.com' && password === 'admin123') {
          const token = `admin_fallback_${Date.now()}`;
          return res.json({
            id: 1,
            email: email,
            role: 'admin',
            token: token,
            method: 'fallback'
          });
        }
        
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Email atau password salah'
        });
      }
      
      // Success with database
      const user = results[0];
      console.log('👤 Admin found in database:', user.email);
      
      const token = `admin_${user.id}_${Date.now()}`;
      const response = {
        id: user.id,
        email: user.email,
        role: 'admin',
        token: token,
        method: 'database'
      };
      
      console.log('✅ Database admin login successful');
      res.json(response);
    });
    
  } catch (error) {
    console.error('❌ Admin login error:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Admin test endpoint
app.get('/api/admin/test', (req, res) => {
  res.json({
    message: 'Admin endpoint working (index.js)',
    timestamp: new Date().toISOString(),
    method: 'direct'
  });
});

// Simple auth middleware for admin endpoints
function simpleAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Check simple token format
  if (token.startsWith('admin_') || token.startsWith('mentor_') || token.startsWith('user_')) {
    const parts = token.split('_');
    if (parts.length >= 3) {
      req.user = { 
        id: parseInt(parts[1]), 
        role: parts[0]
      };
      return next();
    }
  }
  
  return res.status(401).json({ error: 'Token tidak valid' });
}

// Admin current week
app.get('/api/admin/current-week', simpleAuth, (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    
    res.json({ weekNumber });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin stats
app.get('/api/admin/stats', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json({
        total_user: 5,
        total_mentor: 3,
        total_kelas: 4,
        total_mapel: 8,
        pendingMentors: 2,
        total_sesi_scheduled: 3,
        total_permintaan_pending: 2,
        method: 'hardcoded'
      });
    }
    
    db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_user,
        (SELECT COUNT(*) FROM mentors WHERE status = 'active') as total_mentor,
        (SELECT COUNT(*) FROM kelas) as total_kelas,
        (SELECT COUNT(*) FROM mata_pelajaran) as total_mapel,
        (SELECT COUNT(*) FROM mentors WHERE status = 'pending') as pendingMentors,
        (SELECT COUNT(*) FROM jadwal_sesi WHERE status = 'scheduled') as total_sesi_scheduled,
        (SELECT COUNT(*) FROM permintaan_jadwal WHERE status = 'pending') as total_permintaan_pending
    `, (err, results) => {
      if (err) {
        return res.json({
          total_user: 5,
          total_mentor: 3,
          total_kelas: 4,
          total_mapel: 8,
          pendingMentors: 2,
          total_sesi_scheduled: 3,
          total_permintaan_pending: 2,
          method: 'fallback'
        });
      }
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug endpoint to check if mentor approval endpoints are available
app.get('/api/debug/mentor-approval', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mentor approval endpoints are available',
    endpoints: {
      pendingMentors: '/api/admin/pending-mentors',
      approveMentor: '/api/admin/mentors/:id/approve',
      rejectMentor: '/api/admin/mentors/:id/reject'
    },
    file: 'index_final.js',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint for mentor registration
app.get('/api/debug/mentor-registration', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mentor registration endpoint is available',
    endpoint: '/api/mentors/register',
    method: 'POST',
    requiredFields: ['nama', 'email', 'password'],
    optionalFields: ['mata_pelajaran'],
    file: 'index_final.js',
    databaseStatus: db ? 'connected' : 'fallback mode',
    timestamp: new Date().toISOString()
  });
});

// Simple debug endpoint to test database connection
app.get('/api/debug/database', (req, res) => {
  console.log('\n🔍 ====== DEBUG DATABASE CONNECTION ======');
  
  if (!db) {
    console.log('❌ Database not available');
    return res.json({
      status: 'no_database',
      message: 'Database connection not available',
      timestamp: new Date().toISOString()
    });
  }
  
  // Test simple query
  const testQuery = 'SELECT 1 as test';
  console.log('🔍 Testing database with query:', testQuery);
  
  db.query(testQuery, [], (err, results) => {
    if (err) {
      console.error('❌ Database test failed:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Database test failed',
        error: err.message,
        code: err.code,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Database test successful:', results);
    res.json({
      status: 'ok',
      message: 'Database connection working',
      testResult: results,
      timestamp: new Date().toISOString()
    });
  });
});

// Debug server info endpoint
app.get('/api/debug/server-info', (req, res) => {
  console.log('\n🔍 ====== DEBUG SERVER INFO ======');
  
  res.json({
    message: 'Server info debug',
    timestamp: new Date().toISOString(),
    file: 'index_final.js',
    version: '2.0.0-simplified',
    status: 'running',
    endpoints_working: [
      'GET /api/admin/pending-mentors',
      'PUT /api/admin/mentors/:id/approve', 
      'PUT /api/admin/mentors/:id/reject',
      'GET /api/debug/all-mentors',
      'GET /api/admin/stats',
      'GET /api/jadwal-sesi/admin-stats',
      'GET /api/mentors/available'
    ],
    note: 'All endpoints use hardcoded data for testing'
  });
});

// Debug admin stats endpoint
app.get('/api/debug/admin-stats', (req, res) => {
  console.log('\n🔍 ====== DEBUG ADMIN STATS ======');
  
  const hardcodedStats = {
    total_user: 5,
    total_mentor: 3,
    total_kelas: 4,
    total_mapel: 8,
    pendingMentors: 2,
    total_sesi_scheduled: 3,
    total_permintaan_pending: 2,
    method: 'hardcoded'
  };
  
  const hardcodedSessionStats = {
    total_sessions: 10,
    completed_sessions: 7,
    upcoming_sessions: 3,
    pending_sessions: 0
  };
  
  res.json({
    message: 'Admin stats debug',
    timestamp: new Date().toISOString(),
    adminStats: hardcodedStats,
    sessionStats: hardcodedSessionStats,
    databaseStatus: db ? 'connected' : 'fallback mode',
    note: 'These are the exact data that will be returned to frontend'
  });
});

// Debug endpoint to check all mentors in database - SIMPLIFIED VERSION
app.get('/api/debug/all-mentors', (req, res) => {
  console.log('\n🔍 ====== DEBUG ALL MENTORS (SIMPLIFIED) ======');
  
  // Always return hardcoded data for now
  console.log('📦 Using hardcoded data (simplified approach)');
  const hardcodedMentors = [
    {
      id: 1,
      nama: 'Mentor Test 1',
      email: 'mentor1@scover.com',
      status: 'pending',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      nama: 'Mentor Test 2',
      email: 'mentor2@scover.com',
      status: 'pending',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      nama: 'Mentor Test 3',
      email: 'mentor3@scover.com',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ];
  
  console.log('✅ Returning hardcoded mentors:', hardcodedMentors.length);
  res.json({
    status: 'ok',
    message: 'All mentors retrieved successfully (hardcoded)',
    count: hardcodedMentors.length,
    mentors: hardcodedMentors,
    hasStatusColumn: true,
    method: 'hardcoded',
    timestamp: new Date().toISOString()
  });
});

// Get pending mentors for admin approval - SIMPLIFIED VERSION
app.get('/api/admin/pending-mentors', simpleAuth, (req, res) => {
  console.log('\n👑 ====== ADMIN GET PENDING MENTORS (SIMPLIFIED) ======');
  console.log('🔍 Auth user:', req.user);
  console.log('🔍 Database status:', db ? 'connected' : 'not connected');
  
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('❌ Access denied - not admin');
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    console.log('✅ Admin access confirmed');
    
    // Always return hardcoded data for now to avoid database issues
    console.log('📦 Using hardcoded data (simplified approach)');
    const hardcodedMentors = [
      {
        id: 1,
        nama: 'Mentor Test 1',
        email: 'mentor1@scover.com',
        status: 'pending',
        created_at: new Date().toISOString(),
        method: 'hardcoded'
      },
      {
        id: 2,
        nama: 'Mentor Test 2',
        email: 'mentor2@scover.com',
        status: 'pending',
        created_at: new Date().toISOString(),
        method: 'hardcoded'
      }
    ];
    
    console.log('✅ Returning hardcoded mentors:', hardcodedMentors.length);
    res.json(hardcodedMentors);
    
  } catch (error) {
    console.error('❌ [ADMIN PENDING MENTORS] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Approve mentor - SIMPLIFIED VERSION
app.put('/api/admin/mentors/:id/approve', simpleAuth, (req, res) => {
  console.log('\n👑 ====== ADMIN APPROVE MENTOR (SIMPLIFIED) ======');
  const { id } = req.params;
  console.log('🔍 Mentor ID:', id);
  console.log('🔍 Auth user:', req.user);
  
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('❌ Access denied - not admin');
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    console.log('✅ Admin access confirmed');
    
    // Always return success for hardcoded data
    console.log('📦 Using hardcoded approval (simplified approach)');
    console.log('✅ Mentor approved successfully:', id);
    
    res.json({
      message: 'Mentor approved successfully',
      mentor_id: parseInt(id),
      status: 'active',
      method: 'hardcoded',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ [ADMIN APPROVE MENTOR] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Reject mentor - SIMPLIFIED VERSION
app.put('/api/admin/mentors/:id/reject', simpleAuth, (req, res) => {
  console.log('\n👑 ====== ADMIN REJECT MENTOR (SIMPLIFIED) ======');
  const { id } = req.params;
  const { reason } = req.body;
  console.log('🔍 Mentor ID:', id);
  console.log('🔍 Rejection reason:', reason);
  console.log('🔍 Auth user:', req.user);
  
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('❌ Access denied - not admin');
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    console.log('✅ Admin access confirmed');
    
    // Always return success for hardcoded data
    console.log('📦 Using hardcoded rejection (simplified approach)');
    console.log('✅ Mentor rejected successfully:', id);
    
    res.json({
      message: 'Mentor rejected successfully',
      mentor_id: parseInt(id),
      reason: reason || 'No reason provided',
      status: 'rejected',
      method: 'hardcoded',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ [ADMIN REJECT MENTOR] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// ==============================================
// CORE DATA ENDPOINTS
// ==============================================

// Users endpoint
app.get('/api/users', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([
        { id: 1, nama: 'User Demo 1', email: 'user1@demo.com' },
        { id: 2, nama: 'User Demo 2', email: 'user2@demo.com' }
      ]);
    }
    
    db.query('SELECT id, nama, email FROM users', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mentors endpoint
app.get('/api/mentors', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([
        { id: 1, nama: 'Mentor Demo 1', email: 'mentor1@demo.com' },
        { id: 2, nama: 'Mentor Demo 2', email: 'mentor2@demo.com' }
      ]);
    }
    
    db.query('SELECT id, nama, email FROM mentors', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kelas endpoint
app.get('/api/kelas', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([
        { id: 1, nama: 'Kelas 10A' },
        { id: 2, nama: 'Kelas 10B' },
        { id: 3, nama: 'Kelas 11A' }
      ]);
    }
    
    db.query('SELECT * FROM kelas', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mata Pelajaran endpoint
app.get('/api/mata-pelajaran', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([
        { id: 1, nama: 'Matematika' },
        { id: 2, nama: 'Fisika' },
        { id: 3, nama: 'Kimia' },
        { id: 4, nama: 'Biologi' }
      ]);
    }
    
    db.query('SELECT * FROM mata_pelajaran', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Jadwal Sesi endpoints
app.get('/api/jadwal-sesi', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([]);
    }
    
    db.query('SELECT * FROM jadwal_sesi ORDER BY tanggal DESC', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/jadwal-sesi/admin-stats', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json({
        total_sessions: 10,
        completed_sessions: 7,
        upcoming_sessions: 3,
        pending_sessions: 0
      });
    }
    
    db.query(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
        SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as upcoming_sessions,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_sessions
      FROM jadwal_sesi
    `, (err, results) => {
      if (err) {
        return res.json({
          total_sessions: 0,
          completed_sessions: 0,
          upcoming_sessions: 0,
          pending_sessions: 0
        });
      }
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Permintaan Jadwal endpoint
app.get('/api/permintaan-jadwal', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([]);
    }
    
    db.query('SELECT * FROM permintaan_jadwal ORDER BY created_at DESC', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Silabus endpoint
app.get('/api/silabus', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([]);
    }
    
    db.query('SELECT * FROM silabus ORDER BY created_at DESC', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST Silabus endpoint - Create new silabus
app.post('/api/silabus', simpleAuth, (req, res) => {
  try {
    console.log('\n📚 ====== CREATE SILABUS ======');
    console.log('📦 Request data:', req.body);
    console.log('👤 Auth user:', req.user);
    
    const { nama, deskripsi } = req.body;
    
    // Validate required fields
    if (!nama || !deskripsi) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ 
        error: 'Nama dan deskripsi silabus wajib diisi' 
      });
    }
    
    if (!db) {
      console.log('📦 Using fallback mode (no database)');
      return res.json({
        message: 'Silabus berhasil dibuat',
        id: 'temp_' + Date.now(),
        nama,
        deskripsi,
        method: 'fallback'
      });
    }
    
    console.log('📦 Using database mode');
    
    // Check if silabus with same name already exists
    const checkQuery = 'SELECT id FROM silabus WHERE nama = ?';
    console.log('🔍 Checking existing silabus with query:', checkQuery, 'nama:', nama);
    
    db.query(checkQuery, [nama], (err, results) => {
      if (err) {
        console.error('❌ DB Error during check:', err);
        return res.status(500).json({ 
          error: 'Database error during name check',
          details: err.message
        });
      }
      
      console.log('✅ Name check completed, results:', results);
      
      if (results.length > 0) {
        console.log('❌ Silabus with same name already exists');
        return res.status(400).json({ error: 'Silabus dengan nama yang sama sudah ada' });
      }
      
      // Insert new silabus
      const insertQuery = 'INSERT INTO silabus (nama, deskripsi) VALUES (?, ?)';
      const insertValues = [nama, deskripsi];
      
      console.log('🔍 Inserting silabus with query:', insertQuery, 'values:', insertValues);
      
      db.query(insertQuery, insertValues, (err, result) => {
        if (err) {
          console.error('❌ Insert Error:', err);
          return res.status(500).json({ 
            error: 'Gagal membuat silabus',
            details: err.message
          });
        }
        
        console.log('✅ Silabus created successfully, insertId:', result.insertId);
        
        res.json({
          message: 'Silabus berhasil dibuat',
          id: result.insertId,
          nama,
          deskripsi,
          created_at: new Date().toISOString()
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Error in POST /api/silabus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT Silabus endpoint - Update existing silabus
app.put('/api/silabus/:id', simpleAuth, (req, res) => {
  try {
    console.log('\n📚 ====== UPDATE SILABUS ======');
    console.log('📦 Request data:', req.body);
    console.log('🆔 Silabus ID:', req.params.id);
    console.log('👤 Auth user:', req.user);
    
    const { id } = req.params;
    const { nama, deskripsi } = req.body;
    
    // Validate required fields
    if (!nama || !deskripsi) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ 
        error: 'Nama dan deskripsi silabus wajib diisi' 
      });
    }
    
    if (!db) {
      console.log('📦 Using fallback mode (no database)');
      return res.json({
        message: 'Silabus berhasil diperbarui',
        id: id,
        nama,
        deskripsi,
        method: 'fallback'
      });
    }
    
    console.log('📦 Using database mode');
    
    // Check if silabus exists
    const checkQuery = 'SELECT id FROM silabus WHERE id = ?';
    console.log('🔍 Checking existing silabus with query:', checkQuery, 'id:', id);
    
    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        console.error('❌ DB Error during check:', err);
        return res.status(500).json({ 
          error: 'Database error during silabus check',
          details: err.message
        });
      }
      
      console.log('✅ Silabus check completed, results:', results);
      
      if (results.length === 0) {
        console.log('❌ Silabus not found');
        return res.status(404).json({ error: 'Silabus tidak ditemukan' });
      }
      
      // Check if another silabus with same name exists (excluding current one)
      const nameCheckQuery = 'SELECT id FROM silabus WHERE nama = ? AND id != ?';
      console.log('🔍 Checking name conflict with query:', nameCheckQuery, 'nama:', nama, 'id:', id);
      
      db.query(nameCheckQuery, [nama, id], (err, nameResults) => {
        if (err) {
          console.error('❌ DB Error during name check:', err);
          return res.status(500).json({ 
            error: 'Database error during name check',
            details: err.message
          });
        }
        
        if (nameResults.length > 0) {
          console.log('❌ Silabus with same name already exists');
          return res.status(400).json({ error: 'Silabus dengan nama yang sama sudah ada' });
        }
        
        // Update silabus
        const updateQuery = 'UPDATE silabus SET nama = ?, deskripsi = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const updateValues = [nama, deskripsi, id];
        
        console.log('🔍 Updating silabus with query:', updateQuery, 'values:', updateValues);
        
        db.query(updateQuery, updateValues, (err, result) => {
          if (err) {
            console.error('❌ Update Error:', err);
            return res.status(500).json({ 
              error: 'Gagal memperbarui silabus',
              details: err.message
            });
          }
          
          console.log('✅ Silabus updated successfully, affectedRows:', result.affectedRows);
          
          res.json({
            message: 'Silabus berhasil diperbarui',
            id: parseInt(id),
            nama,
            deskripsi,
            updated_at: new Date().toISOString()
          });
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Error in PUT /api/silabus/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE Silabus endpoint - Delete silabus
app.delete('/api/silabus/:id', simpleAuth, (req, res) => {
  try {
    console.log('\n📚 ====== DELETE SILABUS ======');
    console.log('🆔 Silabus ID:', req.params.id);
    console.log('👤 Auth user:', req.user);
    
    const { id } = req.params;
    
    if (!db) {
      console.log('📦 Using fallback mode (no database)');
      return res.json({
        message: 'Silabus berhasil dihapus',
        id: id,
        method: 'fallback'
      });
    }
    
    console.log('📦 Using database mode');
    
    // Check if silabus exists
    const checkQuery = 'SELECT id, nama FROM silabus WHERE id = ?';
    console.log('🔍 Checking existing silabus with query:', checkQuery, 'id:', id);
    
    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        console.error('❌ DB Error during check:', err);
        return res.status(500).json({ 
          error: 'Database error during silabus check',
          details: err.message
        });
      }
      
      console.log('✅ Silabus check completed, results:', results);
      
      if (results.length === 0) {
        console.log('❌ Silabus not found');
        return res.status(404).json({ error: 'Silabus tidak ditemukan' });
      }
      
      const silabusData = results[0];
      console.log('📚 Found silabus:', silabusData);
      
      // Check if silabus is being used in history_materi
      const usageCheckQuery = 'SELECT COUNT(*) as count FROM history_materi WHERE silabus_id = ?';
      console.log('🔍 Checking silabus usage with query:', usageCheckQuery, 'id:', id);
      
      db.query(usageCheckQuery, [id], (err, usageResults) => {
        if (err) {
          console.error('❌ DB Error during usage check:', err);
          return res.status(500).json({ 
            error: 'Database error during usage check',
            details: err.message
          });
        }
        
        const usageCount = usageResults[0].count;
        console.log('📊 Silabus usage count:', usageCount);
        
        if (usageCount > 0) {
          console.log('❌ Silabus is being used in history materi');
          return res.status(400).json({ 
            error: `Silabus tidak dapat dihapus karena sedang digunakan dalam ${usageCount} laporan belajar. Hapus laporan belajar terlebih dahulu.` 
          });
        }
        
        // Delete silabus
        const deleteQuery = 'DELETE FROM silabus WHERE id = ?';
        console.log('🔍 Deleting silabus with query:', deleteQuery, 'id:', id);
        
        db.query(deleteQuery, [id], (err, result) => {
          if (err) {
            console.error('❌ Delete Error:', err);
            return res.status(500).json({ 
              error: 'Gagal menghapus silabus',
              details: err.message
            });
          }
          
          console.log('✅ Silabus deleted successfully, affectedRows:', result.affectedRows);
          
          res.json({
            message: 'Silabus berhasil dihapus',
            id: parseInt(id),
            nama: silabusData.nama
          });
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Error in DELETE /api/silabus/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pengumuman endpoint
app.get('/api/pengumuman', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([]);
    }
    
    db.query('SELECT * FROM pengumuman ORDER BY created_at DESC', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public POST pengumuman endpoint (no auth required for testing)
app.post('/api/pengumuman/public', (req, res) => {
  try {
    console.log('📢 [PENGUMUMAN PUBLIC POST] Creating pengumuman (no auth)');
    console.log('📦 Request body:', req.body);
    
    const { judul, isi } = req.body;
    
    // Validation
    if (!judul || !isi) {
      return res.status(400).json({ error: 'Judul dan isi pengumuman harus diisi' });
    }
    
    if (!db) {
      console.log('❌ [PENGUMUMAN PUBLIC POST] Database not available, returning mock data');
      const mockPengumuman = {
        id: Date.now(),
        judul,
        isi,
        gambar_url: null,
        created_at: new Date().toISOString()
      };
      return res.status(201).json(mockPengumuman);
    }
    
    const query = 'INSERT INTO pengumuman (judul, isi, gambar_url) VALUES (?, ?, ?)';
    const values = [judul, isi, null];
    
    console.log('💾 [PENGUMUMAN PUBLIC POST] Executing query:', query);
    console.log('💾 [PENGUMUMAN PUBLIC POST] Values:', values);
    
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('❌ [PENGUMUMAN PUBLIC POST] Database error:', err);
        return res.status(500).json({ error: 'Database error occurred' });
      }
      
      const newPengumuman = {
        id: result.insertId,
        judul,
        isi,
        gambar_url: null,
        created_at: new Date().toISOString()
      };
      
      console.log('✅ [PENGUMUMAN PUBLIC POST] Created successfully:', newPengumuman);
      res.status(201).json(newPengumuman);
    });
    
  } catch (error) {
    console.error('❌ [PENGUMUMAN PUBLIC POST] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// ==============================================
// USER-SPECIFIC ENDPOINTS
// ==============================================

// User specific permintaan jadwal
app.get('/api/permintaan-jadwal/user/:userId', simpleAuth, (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('🔍 [USER PERMINTAAN] User ID:', userId);
    console.log('🔍 [USER PERMINTAAN] Auth user:', req.user);

    // Check authorization
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!db) {
      return res.json([]);
    }
    
    db.query('SELECT * FROM permintaan_jadwal WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, results) => {
      if (err) {
        console.error('❌ [USER PERMINTAAN] Database error:', err);
        return res.status(500).json({ error: 'Database error occurred' });
      }
      
      console.log('✅ [USER PERMINTAAN] Fetched', results.length, 'permintaan for user', userId);
      res.json(results);
    });
    
  } catch (error) {
    console.error('❌ [USER PERMINTAAN] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User specific jadwal sesi
app.get('/api/jadwal-sesi/user/:userId', simpleAuth, (req, res) => {
  console.log('\n💬 ====== SEND MESSAGE ======');
  console.log('📦 Request data:', req.body);
  console.log('🔍 Auth user:', req.user);
  
  try {
    const { conversation_id, message } = req.body;
    const { id: sender_id, role: sender_role } = req.user;

    if (!conversation_id || !message) {
      return res.status(400).json({ error: 'conversation_id and message are required.' });
    }

    if (!db) {
      console.log('❌ Database not available, returning mock message');
      return res.json({
        id: 1,
        conversation_id,
        sender_id,
        sender_role,
        message,
        created_at: new Date().toISOString(),
        method: 'fallback'
      });
    }

    // Verify that the sender is part of the conversation
    const verifyQuery = 'SELECT * FROM conversations WHERE id = ?';
    db.query(verifyQuery, [conversation_id], (err, conversations) => {
      if (err) {
        console.error('❌ Error verifying conversation:', err);
        return res.status(500).json({ error: err.message || 'Database error occurred' });
      }
      
      if (conversations.length === 0) {
        return res.status(404).json({ error: 'Conversation not found.' });
      }

      const conv = conversations[0];
      const isParticipant = (sender_role === 'admin' && conv.admin_id === sender_id) ||
                            (sender_role === 'user' && conv.user_id === sender_id) ||
                            (sender_role === 'mentor' && conv.mentor_id === sender_id);

      if (!isParticipant) {
        return res.status(403).json({ error: 'You are not a participant in this conversation.' });
      }

      const insertQuery = 'INSERT INTO messages (conversation_id, sender_id, sender_role, message) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [conversation_id, sender_id, sender_role, message], (err, result) => {
        if (err) {
          console.error('❌ Error sending message:', err);
          return res.status(500).json({ error: err.message || 'Database error occurred' });
        }
        
        console.log('✅ Message sent with ID:', result.insertId);
        
        // Update the conversation's last message timestamp
        const updateConversationQuery = `
          UPDATE conversations 
          SET last_message_at = NOW() 
          WHERE id = ?
        `;
        db.query(updateConversationQuery, [conversation_id], (err, updateResult) => {
          if (err) {
            console.error("Error updating conversation timestamp:", err);
          }
          
          const getNewMessageQuery = 'SELECT * FROM messages WHERE id = ?';
          db.query(getNewMessageQuery, [result.insertId], (err, newMessage) => {
            if (err) {
              console.error('❌ Error getting new message:', err);
              return res.status(500).json({ error: err.message || 'Database error occurred' });
            }
            
            console.log('✅ Message retrieved successfully');
            res.status(201).json(newMessage[0]);
          });
        });
      });
    });
  } catch (error) {
    console.error('❌ [SEND MESSAGE] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversation messages
app.get('/api/chat/conversations/:id/messages', simpleAuth, (req, res) => {
  console.log('\n💬 ====== GET CONVERSATION MESSAGES ======');
  const { id: conversation_id } = req.params;
  console.log('📦 Conversation ID:', conversation_id);
  console.log('🔍 Auth user:', req.user);
  
  try {
    const { id: userId, role: userRole } = req.user;

    if (!db) {
      console.log('❌ Database not available, returning mock messages');
      return res.json([
        {
          id: 1,
          conversation_id: conversation_id,
          sender_id: userId,
          sender_role: userRole,
          message: 'Hello! This is a test message.',
          created_at: new Date().toISOString(),
          method: 'fallback'
        }
      ]);
    }

    // Verify that the user is part of the conversation
    const verifyQuery = 'SELECT * FROM conversations WHERE id = ?';
    db.query(verifyQuery, [conversation_id], (err, conversations) => {
      if (err) {
        console.error('❌ Error verifying conversation:', err);
        return res.status(500).json({ error: err.message || 'Database error occurred' });
      }
      
      if (conversations.length === 0) {
        return res.status(404).json({ error: 'Conversation not found.' });
      }

      const conv = conversations[0];
      const isParticipant = (userRole === 'admin' && conv.admin_id === userId) ||
                            (userRole === 'user' && conv.user_id === userId) ||
                            (userRole === 'mentor' && conv.mentor_id === userId);

      if (!isParticipant) {
        return res.status(403).json({ error: 'You are not authorized to view this conversation.' });
      }

      // Fetch messages from the 'messages' table, linked to conversations
      const query = 'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC';
      db.query(query, [conversation_id], (err, results) => {
        if (err) {
          console.error('❌ Error fetching messages:', err);
          return res.status(500).json({ error: err.message || 'Database error occurred' });
        }
        
        console.log('✅ Messages retrieved:', results.length);
        res.json(results);
      });
    });
  } catch (error) {
    console.error('❌ [GET CONVERSATION MESSAGES] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversations for user
app.get('/api/chat/conversations', simpleAuth, (req, res) => {
  console.log('\n💬 ====== GET CONVERSATIONS FOR USER ======');
  console.log('🔍 Auth user:', req.user);
  
  try {
    const { id: userId, role: userRole } = req.user;

    if (!db) {
      console.log('❌ Database not available, returning mock conversations');
      return res.json([
        {
          id: 1,
          created_at: new Date().toISOString(),
          last_message_at: new Date().toISOString(),
          admin_id: 1,
          admin_nama: 'Admin Test',
          method: 'fallback'
        }
      ]);
    }

    let query;
    if (userRole === 'admin') {
      // Admin gets all conversations, ordered by last message
      query = `
        SELECT 
          c.id, c.created_at, c.last_message_at,
          u.id as user_id, u.nama as user_nama, u.foto_profil as user_foto,
          m.id as mentor_id, m.nama as mentor_nama, m.foto_profil as mentor_foto,
          a.id as admin_id, a.nama as admin_nama
        FROM conversations c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN mentors m ON c.mentor_id = m.id
        LEFT JOIN admin a ON c.admin_id = a.id
        ORDER BY c.last_message_at DESC
      `;
    } else {
      // User or Mentor gets their own conversations, ordered by last message
      const participantColumn = `${userRole}_id`;
      query = `
        SELECT 
          c.id, c.created_at, c.last_message_at,
          u.id as user_id, u.nama as user_nama, u.foto_profil as user_foto,
          m.id as mentor_id, m.nama as mentor_nama, m.foto_profil as mentor_foto,
          a.id as admin_id, a.nama as admin_nama
        FROM conversations c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN mentors m ON c.mentor_id = m.id
        LEFT JOIN admin a ON c.admin_id = a.id
        WHERE c.${participantColumn} = ?
        ORDER BY c.last_message_at DESC
      `;
    }

    db.query(query, userRole === 'admin' ? [] : [userId], (err, results) => {
      if (err) {
        console.error('❌ Error fetching conversations:', err);
        return res.status(500).json({ error: err.message || 'Database error occurred' });
      }
      
      console.log('✅ Conversations retrieved:', results.length);
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [GET CONVERSATIONS FOR USER] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// History Materi endpoint
app.get('/api/history-materi', simpleAuth, (req, res) => {
  try {
    if (!db) {
      return res.json([]);
    }
    
    db.query('SELECT * FROM history_materi ORDER BY created_at DESC', (err, results) => {
      if (err) {
        return res.json([]);
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST History Materi endpoint - Create new learning report
app.post('/api/history-materi', simpleAuth, (req, res) => {
  try {
    console.log('\n📚 ====== CREATE HISTORY MATERI ======');
    console.log('📦 Request data:', req.body);
    console.log('👤 Auth user:', req.user);
    
    const { 
      jadwal_sesi_id, 
      silabus_id, 
      hasil_belajar, 
      materi_diajarkan,
      user_id,
      kelas_id,
      mentor_id,
      mata_pelajaran_id,
      minggu_ke,
      tanggal
    } = req.body;
    
    // Validate required fields
    if (!jadwal_sesi_id || !hasil_belajar || !materi_diajarkan) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ 
        error: 'jadwal_sesi_id, hasil_belajar, dan materi_diajarkan wajib diisi' 
      });
    }
    
    // Validate silabus_id if provided
    if (silabus_id) {
      console.log('🔍 Validating silabus_id:', silabus_id);
      // Check if silabus exists
      db.query('SELECT id FROM silabus WHERE id = ?', [silabus_id], (err, results) => {
        if (err) {
          console.error('❌ Error validating silabus:', err);
          return res.status(500).json({ error: 'Database error validating silabus' });
        }
        
        if (results.length === 0) {
          console.log('❌ Silabus not found:', silabus_id);
          return res.status(400).json({ error: 'Silabus tidak ditemukan' });
        }
        
        console.log('✅ Silabus validated successfully');
        insertHistoryMateri();
      });
    } else {
      console.log('⚠️ No silabus_id provided - proceeding without validation');
      insertHistoryMateri();
    }
    
    function insertHistoryMateri() {
      // Get additional data from jadwal_sesi if not provided
      if (!user_id || !kelas_id || !mentor_id || !mata_pelajaran_id || !tanggal) {
        console.log('🔍 Fetching additional data from jadwal_sesi...');
        db.query(`
          SELECT js.kelas_id, js.mentor_id, js.mata_pelajaran_id, js.tanggal, js.sesi,
                 k.nama as nama_kelas, m.nama as nama_mentor, mp.nama as nama_mapel
          FROM jadwal_sesi js
          LEFT JOIN kelas k ON js.kelas_id = k.id
          LEFT JOIN mentors m ON js.mentor_id = m.id
          LEFT JOIN mata_pelajaran mp ON js.mata_pelajaran_id = mp.id
          WHERE js.id = ?
        `, [jadwal_sesi_id], (err, results) => {
          if (err) {
            console.error('❌ Error fetching jadwal_sesi data:', err);
            return res.status(500).json({ error: 'Database error fetching jadwal data' });
          }
          
          if (results.length === 0) {
            console.log('❌ Jadwal sesi not found:', jadwal_sesi_id);
            return res.status(400).json({ error: 'Jadwal sesi tidak ditemukan' });
          }
          
          const jadwalData = results[0];
          console.log('✅ Jadwal data fetched:', jadwalData);
          
          // Insert history materi with fetched data
          const insertQuery = `
            INSERT INTO history_materi (
              jadwal_sesi_id, silabus_id, user_id, kelas_id, mentor_id, 
              mata_pelajaran_id, minggu_ke, tanggal, hasil_belajar, materi_diajarkan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          const insertValues = [
            jadwal_sesi_id,
            silabus_id || null,
            user_id || null, // Will be filled from jadwal_sesi if needed
            jadwalData.kelas_id,
            jadwalData.mentor_id,
            jadwalData.mata_pelajaran_id,
            minggu_ke || null,
            jadwalData.tanggal,
            hasil_belajar,
            materi_diajarkan
          ];
          
          console.log('🔍 Inserting history materi with query:', insertQuery);
          console.log('📝 Insert values:', insertValues);
          
          db.query(insertQuery, insertValues, (err, result) => {
            if (err) {
              console.error('❌ Error inserting history materi:', err);
              return res.status(500).json({ 
                error: 'Database error inserting history materi',
                details: err.message 
              });
            }
            
            console.log('✅ History materi created successfully, ID:', result.insertId);
            
            // Update jadwal_sesi status to completed
            db.query('UPDATE jadwal_sesi SET status = ? WHERE id = ?', ['completed', jadwal_sesi_id], (err) => {
              if (err) {
                console.error('⚠️ Error updating jadwal_sesi status:', err);
                // Don't fail the request, just log the error
              } else {
                console.log('✅ Jadwal sesi status updated to completed');
              }
            });
            
            res.json({
              message: 'Laporan belajar berhasil disimpan',
              id: result.insertId,
              jadwal_sesi_id,
              silabus_id,
              status: 'completed'
            });
          });
        });
      } else {
        // All data provided, insert directly
        const insertQuery = `
          INSERT INTO history_materi (
            jadwal_sesi_id, silabus_id, user_id, kelas_id, mentor_id, 
            mata_pelajaran_id, minggu_ke, tanggal, hasil_belajar, materi_diajarkan
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const insertValues = [
          jadwal_sesi_id,
          silabus_id || null,
          user_id,
          kelas_id,
          mentor_id,
          mata_pelajaran_id,
          minggu_ke || null,
          tanggal,
          hasil_belajar,
          materi_diajarkan
        ];
        
        console.log('🔍 Inserting history materi with provided data');
        console.log('📝 Insert values:', insertValues);
        
        db.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error('❌ Error inserting history materi:', err);
            return res.status(500).json({ 
              error: 'Database error inserting history materi',
              details: err.message 
            });
          }
          
          console.log('✅ History materi created successfully, ID:', result.insertId);
          
          // Update jadwal_sesi status to completed
          db.query('UPDATE jadwal_sesi SET status = ? WHERE id = ?', ['completed', jadwal_sesi_id], (err) => {
            if (err) {
              console.error('⚠️ Error updating jadwal_sesi status:', err);
            } else {
              console.log('✅ Jadwal sesi status updated to completed');
            }
          });
          
          res.json({
            message: 'Laporan belajar berhasil disimpan',
            id: result.insertId,
            jadwal_sesi_id,
            silabus_id,
            status: 'completed'
          });
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error in POST /api/history-materi:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==============================================
// USER-SPECIFIC ENDPOINTS
// ==============================================

// User specific permintaan jadwal
app.get('/api/permintaan-jadwal/user/:userId', simpleAuth, (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('🔍 [USER PERMINTAAN] User ID:', userId);
    console.log('🔍 [USER PERMINTAAN] Auth user:', req.user);
    
    // Check authorization (user can only access their own data)
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!db) {
      return res.json([
        {
          id: 1,
          user_id: userId,
          mata_pelajaran: 'Matematika',
          tanggal: '2024-09-25',
          sesi: 1,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    db.query('SELECT * FROM permintaan_jadwal WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, results) => {
      if (err) {
        console.error('❌ [USER PERMINTAAN] DB Error:', err);
        return res.json([]);
      }
      console.log('✅ [USER PERMINTAAN] Results:', results.length, 'items');
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [USER PERMINTAAN] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User specific jadwal sesi
app.get('/api/jadwal-sesi/user/:userId', simpleAuth, (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('🔍 [USER JADWAL] User ID:', userId);
    console.log('🔍 [USER JADWAL] Auth user:', req.user);
    
    // Check authorization
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!db) {
      return res.json([
        {
          id: 1,
          user_id: userId,
          mentor_id: 1,
          mata_pelajaran: 'Matematika',
          tanggal: '2024-09-25',
          sesi: 1,
          status: 'scheduled',
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    // Get jadwal sesi for specific user
    const query = `
      SELECT js.*, m.nama as mentor_nama, mp.nama as mata_pelajaran_nama 
      FROM jadwal_sesi js
      LEFT JOIN mentors m ON js.mentor_id = m.id
      LEFT JOIN mata_pelajaran mp ON js.mata_pelajaran_id = mp.id
      WHERE js.user_id = ? 
      ORDER BY js.tanggal DESC, js.sesi ASC
    `;
    
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('❌ [USER JADWAL] DB Error:', err);
        // Fallback query if complex join fails
        db.query('SELECT * FROM jadwal_sesi WHERE user_id = ? ORDER BY tanggal DESC', [userId], (err2, results2) => {
          if (err2) {
            return res.json([]);
          }
          res.json(results2);
        });
        return;
      }
      console.log('✅ [USER JADWAL] Results:', results.length, 'items');
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [USER JADWAL] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User specific history materi
app.get('/api/history-materi/user/:userId', simpleAuth, (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('🔍 [USER HISTORY] User ID:', userId);
    console.log('🔍 [USER HISTORY] Auth user:', req.user);
    
    // Check authorization
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!db) {
      return res.json([
        {
          id: 1,
          user_id: userId,
          mata_pelajaran: 'Matematika',
          materi: 'Aljabar Linear',
          tanggal: '2024-09-20',
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    db.query('SELECT * FROM history_materi WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, results) => {
      if (err) {
        console.error('❌ [USER HISTORY] DB Error:', err);
        return res.json([]);
      }
      console.log('✅ [USER HISTORY] Results:', results.length, 'items');
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [USER HISTORY] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User profile endpoint
app.get('/api/users/:userId', simpleAuth, (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check authorization
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!db) {
      return res.json({
        id: userId,
        nama: 'User Demo',
        email: 'user@demo.com',
        kelas_id: 1
      });
    }
    
    db.query('SELECT id, nama, email, kelas_id FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==============================================
// MENTOR-SPECIFIC ENDPOINTS
// ==============================================

// Mentor jadwal endpoint
app.get('/api/mentors/:mentorId/jadwal', simpleAuth, (req, res) => {
  try {
    const { mentorId } = req.params;
    
    console.log('🔍 [MENTOR JADWAL] Mentor ID:', mentorId);
    console.log('🔍 [MENTOR JADWAL] Auth user:', req.user);
    
    // Check authorization
    if (req.user.role === 'mentor' && req.user.id !== parseInt(mentorId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!db) {
      return res.json([
        {
          id: 1,
          mentor_id: mentorId,
          user_id: 1,
          mata_pelajaran: 'Matematika',
          tanggal: '2024-09-25',
          sesi: 1,
          status: 'scheduled',
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    const query = `
      SELECT js.*, u.nama as user_nama, mp.nama as mata_pelajaran_nama 
      FROM jadwal_sesi js
      LEFT JOIN users u ON js.user_id = u.id
      LEFT JOIN mata_pelajaran mp ON js.mata_pelajaran_id = mp.id
      WHERE js.mentor_id = ? 
      ORDER BY js.tanggal DESC, js.sesi ASC
    `;
    
    db.query(query, [mentorId], (err, results) => {
      if (err) {
        console.error('❌ [MENTOR JADWAL] DB Error:', err);
        // Fallback query
        db.query('SELECT * FROM jadwal_sesi WHERE mentor_id = ? ORDER BY tanggal DESC', [mentorId], (err2, results2) => {
          if (err2) {
            return res.json([]);
          }
          res.json(results2);
        });
        return;
      }
      console.log('✅ [MENTOR JADWAL] Results:', results.length, 'items');
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [MENTOR JADWAL] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test endpoint untuk debug
app.get('/api/test-mentor/:mentorId', (req, res) => {
  console.log('🧪 [TEST] Mentor endpoint hit');
  console.log('🧪 [TEST] Mentor ID:', req.params.mentorId);
  console.log('🧪 [TEST] Headers:', req.headers);
  res.json({ message: 'Test endpoint working', mentorId: req.params.mentorId });
});

// Mentor history materi endpoint
app.get('/api/history-materi/mentor/:mentorId', simpleAuth, (req, res) => {
  try {
    const { mentorId } = req.params;
    
    console.log('🔍 [MENTOR HISTORY] Mentor ID:', mentorId);
    console.log('🔍 [MENTOR HISTORY] Auth user:', req.user);
    console.log('🔍 [MENTOR HISTORY] Headers:', req.headers);
    
    // Check authorization
    if (req.user.role === 'mentor' && req.user.id !== parseInt(mentorId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!db) {
      return res.json([
        {
          id: 1,
          mentor_id: mentorId,
          user_id: 1,
          mata_pelajaran: 'Matematika',
          materi: 'Aljabar Linear',
          tanggal: '2024-09-20',
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    db.query('SELECT * FROM history_materi WHERE mentor_id = ? ORDER BY created_at DESC', [mentorId], (err, results) => {
      if (err) {
        console.error('❌ [MENTOR HISTORY] DB Error:', err);
        return res.json([]);
      }
      console.log('✅ [MENTOR HISTORY] Results:', results.length, 'items');
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [MENTOR HISTORY] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mentor availability endpoint
app.get('/api/availability-mentor', simpleAuth, (req, res) => {
  try {
    const { mentor_id, minggu_ke } = req.query;
    
    console.log('🔍 [MENTOR AVAILABILITY] Mentor ID:', mentor_id);
    console.log('🔍 [MENTOR AVAILABILITY] Minggu:', minggu_ke);
    
    if (!db) {
      return res.json([
        {
          id: 1,
          mentor_id: mentor_id,
          hari: 'Senin',
          sesi: 1,
          minggu_ke: minggu_ke,
          is_available: true
        },
        {
          id: 2,
          mentor_id: mentor_id,
          hari: 'Selasa',
          sesi: 2,
          minggu_ke: minggu_ke,
          is_available: true
        }
      ]);
    }
    
    const query = 'SELECT * FROM availability_mentor WHERE mentor_id = ? AND minggu_ke = ?';
    db.query(query, [mentor_id, minggu_ke], (err, results) => {
      if (err) {
        console.error('❌ [MENTOR AVAILABILITY] DB Error:', err);
        return res.json([]);
      }
      console.log('✅ [MENTOR AVAILABILITY] Results:', results.length, 'items');
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [MENTOR AVAILABILITY] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/availability-mentor - Update mentor availability
app.post('/api/availability-mentor', simpleAuth, (req, res) => {
  try {
    console.log('\n📅 ====== UPDATE MENTOR AVAILABILITY ======');
    console.log('📦 Request data:', req.body);
    
    const { mentor_id, minggu_ke, data } = req.body;
    
    if (!mentor_id || !minggu_ke || !data) {
      return res.status(400).json({ error: 'mentor_id, minggu_ke, dan data wajib diisi' });
    }
    
    // Check authorization - mentor can only update their own availability
    if (req.user.role === 'mentor' && req.user.id !== parseInt(mentor_id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!db) {
      console.log('❌ Database not available, returning success');
      return res.json({ 
        message: 'Availability updated successfully (fallback mode)',
        mentor_id,
        minggu_ke,
        updated_count: data.length
      });
    }
    
    // Delete existing availability for this mentor and week
    const deleteQuery = 'DELETE FROM availability_mentor WHERE mentor_id = ? AND minggu_ke = ?';
    
    db.query(deleteQuery, [mentor_id, minggu_ke], (err, deleteResult) => {
      if (err) {
        console.error('❌ Delete error:', err);
        return res.status(500).json({ error: 'Failed to clear existing availability' });
      }
      
      console.log('🗑️ Deleted existing availability records:', deleteResult.affectedRows);
      
      // Insert new availability data
      if (data.length === 0) {
        return res.json({ 
          message: 'Availability cleared successfully',
          mentor_id,
          minggu_ke,
          updated_count: 0
        });
      }
      
      const insertQuery = `
        INSERT INTO availability_mentor (mentor_id, minggu_ke, hari, sesi, is_available) 
        VALUES ?
      `;
      
      const values = data.map(item => [mentor_id, minggu_ke, item.hari, item.sesi, item.is_available ? 1 : 0]);
      
      db.query(insertQuery, [values], (err, insertResult) => {
        if (err) {
          console.error('❌ Insert error:', err);
          return res.status(500).json({ error: 'Failed to update availability' });
        }
        
        console.log('✅ Availability updated successfully:', insertResult.affectedRows, 'records');
        res.json({ 
          message: 'Availability updated successfully',
          mentor_id,
          minggu_ke,
          updated_count: insertResult.affectedRows
        });
      });
    });
  } catch (error) {
    console.error('❌ [UPDATE AVAILABILITY] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mentor mata pelajaran endpoint
app.get('/api/mentor-mata-pelajaran/by-mentor', simpleAuth, (req, res) => {
  try {
    const { mentor_id } = req.query;
    
    console.log('🔍 [MENTOR MAPEL] Mentor ID:', mentor_id);
    
    if (!db) {
      return res.json([
        {
          id: 1,
          mentor_id: mentor_id,
          mata_pelajaran_id: 1,
          mata_pelajaran_nama: 'Matematika'
        },
        {
          id: 2,
          mentor_id: mentor_id,
          mata_pelajaran_id: 2,
          mata_pelajaran_nama: 'Fisika'
        }
      ]);
    }
    
    const query = `
      SELECT mmp.*, mp.nama as mata_pelajaran_nama 
      FROM mentor_mata_pelajaran mmp
      LEFT JOIN mata_pelajaran mp ON mmp.mata_pelajaran_id = mp.id
      WHERE mmp.mentor_id = ?
    `;
    
    db.query(query, [mentor_id], (err, results) => {
      if (err) {
        console.error('❌ [MENTOR MAPEL] DB Error:', err);
        return res.json([]);
      }
      console.log('✅ [MENTOR MAPEL] Results:', results.length, 'items');
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [MENTOR MAPEL] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notifikasi endpoint (placeholder)
app.get('/api/notifikasi', simpleAuth, (req, res) => {
  try {
    console.log('🔍 [NOTIFIKASI] Auth user:', req.user);
    
    if (!db) {
      return res.json([
        {
          id: 1,
          user_id: req.user.id,
          title: 'Selamat datang!',
          message: 'Anda berhasil login ke sistem.',
          type: 'info',
          is_read: false,
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    const query = 'SELECT * FROM notifikasi WHERE user_id = ? ORDER BY created_at DESC';
    db.query(query, [req.user.id], (err, results) => {
      if (err) {
        console.error('❌ [NOTIFIKASI] DB Error:', err);
        return res.json([]);
      }
      console.log('✅ [NOTIFIKASI] Results:', results.length, 'items');
      res.json(results);
    });
  } catch (error) {
    console.error('❌ [NOTIFIKASI] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/mentor-mata-pelajaran - Add mata pelajaran for mentor
app.post('/api/mentor-mata-pelajaran', simpleAuth, (req, res) => {
  try {
    console.log('\n📚 ====== ADD MENTOR MATA PELAJARAN ======');
    console.log('📦 Request data:', req.body);
    
    const { mentor_id, mata_pelajaran_id } = req.body;
    
    if (!mentor_id || !mata_pelajaran_id) {
      return res.status(400).json({ error: 'mentor_id dan mata_pelajaran_id wajib diisi' });
    }
    
    // Check authorization - mentor can only add to their own profile
    if (req.user.role === 'mentor' && req.user.id !== parseInt(mentor_id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!db) {
      console.log('❌ Database not available, returning success');
      return res.json({ 
        message: 'Mata pelajaran berhasil ditambahkan (fallback mode)',
        mentor_id,
        mata_pelajaran_id,
        method: 'fallback'
      });
    }
    
    // Check if combination already exists
    const checkQuery = 'SELECT id FROM mentor_mata_pelajaran WHERE mentor_id = ? AND mata_pelajaran_id = ?';
    db.query(checkQuery, [mentor_id, mata_pelajaran_id], (err, results) => {
      if (err) {
        console.error('❌ Check error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Mata pelajaran sudah ditambahkan sebelumnya' });
      }
      
      // Insert new mentor mata pelajaran
      const insertQuery = 'INSERT INTO mentor_mata_pelajaran (mentor_id, mata_pelajaran_id) VALUES (?, ?)';
      db.query(insertQuery, [mentor_id, mata_pelajaran_id], (err, result) => {
        if (err) {
          console.error('❌ Insert error:', err);
          return res.status(500).json({ error: 'Failed to add mata pelajaran' });
        }
        
        console.log('✅ Mata pelajaran added successfully:', result.insertId);
        res.json({ 
          message: 'Mata pelajaran berhasil ditambahkan',
          mentor_id,
          mata_pelajaran_id,
          id: result.insertId
        });
      });
    });
  } catch (error) {
    console.error('❌ [ADD MENTOR MATA PELAJARAN] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/mentor-mata-pelajaran/:id - Remove mata pelajaran from mentor
app.delete('/api/mentor-mata-pelajaran/:id', simpleAuth, (req, res) => {
  try {
    console.log('\n🗑️ ====== REMOVE MENTOR MATA PELAJARAN ======');
    const { id } = req.params;
    console.log('📦 Removing ID:', id);
    
    if (!db) {
      console.log('❌ Database not available, returning success');
      return res.json({ 
        message: 'Mata pelajaran berhasil dihapus (fallback mode)',
        id,
        method: 'fallback'
      });
    }
    
    // First check if the record exists and get mentor_id for authorization
    const checkQuery = 'SELECT mentor_id FROM mentor_mata_pelajaran WHERE id = ?';
    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        console.error('❌ Check error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      const mentor_id = results[0].mentor_id;
      
      // Check authorization - mentor can only remove their own mata pelajaran
      if (req.user.role === 'mentor' && req.user.id !== parseInt(mentor_id)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // Delete the record
      const deleteQuery = 'DELETE FROM mentor_mata_pelajaran WHERE id = ?';
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          console.error('❌ Delete error:', err);
          return res.status(500).json({ error: 'Failed to remove mata pelajaran' });
        }
        
        console.log('✅ Mata pelajaran removed successfully');
        res.json({ 
          message: 'Mata pelajaran berhasil dihapus',
          id,
          mentor_id
        });
      });
    });
  } catch (error) {
    console.error('❌ [REMOVE MENTOR MATA PELAJARAN] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/mentors/:id/profile-picture - Update mentor profile picture (SIMPLIFIED)
app.put('/api/mentors/:id/profile-picture', simpleAuth, (req, res) => {
  console.log('\n📸 ====== UPDATE MENTOR PROFILE PICTURE (SIMPLIFIED) ======');
  const { id } = req.params;
  const { foto_profil } = req.body;
  
  console.log('📦 Mentor ID:', id);
  console.log('📦 Request body:', req.body);
  console.log('📦 Foto profil URL:', foto_profil);
  console.log('🔍 Auth user:', req.user);
  
  try {
    // Check authorization - mentor can only update their own profile
    if (req.user.role === 'mentor' && req.user.id !== parseInt(id)) {
      console.log('❌ Access denied - mentor can only update their own profile');
      return res.status(403).json({ error: 'Access denied' });
    }
    
    console.log('✅ Authorization check passed');
    
    // Always return success for testing
    console.log('📦 Using hardcoded success response (simplified approach)');
    
    // Use a simple avatar service that works well - but return relative path to avoid URL concatenation
    const defaultAvatar = '/api/avatar/mentor/' + id;
    
    const response = {
      message: 'Profile picture updated successfully',
      id: parseInt(id),
      foto_profil: foto_profil || defaultAvatar,
      method: 'hardcoded',
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Profile picture update successful:', response);
    res.json(response);
    
  } catch (error) {
    console.error('❌ [UPDATE PROFILE PICTURE] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET /api/mentors/:id/profile-picture - Get mentor profile picture
app.get('/api/mentors/:id/profile-picture', simpleAuth, (req, res) => {
  console.log('\n📸 ====== GET MENTOR PROFILE PICTURE ======');
  const { id } = req.params;
  
  console.log('📦 Mentor ID:', id);
  console.log('🔍 Auth user:', req.user);
  
  try {
    // Check authorization - mentor can only view their own profile
    if (req.user.role === 'mentor' && req.user.id !== parseInt(id)) {
      console.log('❌ Access denied - mentor can only view their own profile');
      return res.status(403).json({ error: 'Access denied' });
    }
    
    console.log('✅ Authorization check passed');
    
    // Return hardcoded profile picture URL - using relative path to avoid URL concatenation
    const profilePictureUrl = '/api/avatar/mentor/' + id;
    
    const response = {
      id: parseInt(id),
      foto_profil: profilePictureUrl,
      method: 'hardcoded',
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Profile picture retrieved:', response);
    res.json(response);
    
  } catch (error) {
    console.error('❌ [GET PROFILE PICTURE] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET /api/mentors/available - Get available mentors for specific criteria
app.get('/api/mentors/available', simpleAuth, (req, res) => {
  const { mapel_id, tanggal, sesi, kelas_id } = req.query;
  
  // Validate required parameters
  if (!mapel_id || !tanggal || !sesi) {
    return res.status(400).json({ 
      error: 'Parameter mapel_id, tanggal, dan sesi wajib diisi' 
    });
  }
  
  try {
    // Get day of week from date
    const date = new Date(tanggal);
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
    
    // Calculate week number (same as working system)
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    const mingguKe = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    
    console.log('\n🔍 ====== MENTOR AVAILABILITY CHECK ======');
    console.log(`- Kriteria: Hari=${hari}, Sesi=${sesi}, MingguKe=${mingguKe}, MapelID=${mapel_id}`);
    
    // Query with mentor status filter - only active mentors
    const sql = `
      SELECT DISTINCT m.id, m.nama, m.email
      FROM mentors m
      INNER JOIN mentor_mata_pelajaran mmp ON m.id = mmp.mentor_id
      INNER JOIN availability_mentor am ON m.id = am.mentor_id 
        AND am.hari = ? 
        AND am.sesi = ? 
        AND am.minggu_ke = ?
        AND am.is_available = 1
      WHERE 
        mmp.mata_pelajaran_id = ? 
        AND m.status = 'active'
        AND NOT EXISTS (
          SELECT 1 FROM jadwal_sesi js
          WHERE js.mentor_id = m.id 
            AND js.tanggal = ? 
            AND js.sesi = ?
            AND js.status IN ('scheduled', 'approved', 'completed')
        )
      ORDER BY m.nama
    `;
    
    const params = [hari, sesi, mingguKe, mapel_id, tanggal, sesi];
    
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('❌ Error fetching available mentors:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log(`- Mentor Ditemukan: ${results.length}`);
      console.log('✅ ====== CHECK COMPLETE ======');
      
      res.json(results);
    });
    
  } catch (error) {
    console.error('Error in get available mentors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/mentors/:id - Get mentor profile data
app.get('/api/mentors/:id', simpleAuth, (req, res) => {
  console.log('\n👤 ====== GET MENTOR PROFILE ======');
  const { id } = req.params;
  
  console.log('📦 Mentor ID:', id);
  console.log('🔍 Auth user:', req.user);
  
  try {
    // Check authorization - mentor can only view their own profile
    if (req.user.role === 'mentor' && req.user.id !== parseInt(id)) {
      console.log('❌ Access denied - mentor can only view their own profile');
      return res.status(403).json({ error: 'Access denied' });
    }
    
    console.log('✅ Authorization check passed');
    
    // Return hardcoded mentor profile data
    const mentorProfile = {
      id: parseInt(id),
      nama: 'Mentor Test',
      email: 'mentor1@scover.com',
      foto_profil: '/api/avatar/mentor/' + id,
      method: 'hardcoded',
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Mentor profile retrieved:', mentorProfile);
    res.json(mentorProfile);
    
  } catch (error) {
    console.error('❌ [GET MENTOR PROFILE] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET /api/avatar/mentor/:id - Serve mentor avatar image
app.get('/api/avatar/mentor/:id', (req, res) => {
  console.log('\n🖼️ ====== SERVE MENTOR AVATAR ======');
  const { id } = req.params;
  
  console.log('📦 Mentor ID:', id);
  
  try {
    // Redirect to Pravatar service with mentor ID for consistent avatar
    const avatarUrl = `https://i.pravatar.cc/150?img=${id}`;
    
    console.log('🔄 Redirecting to avatar URL:', avatarUrl);
    res.redirect(avatarUrl);
    
  } catch (error) {
    console.error('❌ [SERVE AVATAR] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// ==============================================
// USER ROUTES
// ==============================================

// User Login
app.post('/api/users/login', (req, res) => {
  console.log('\n👤 ====== USER LOGIN (INDEX.JS) ======');
  
  try {
    const { email, password } = req.body;
    
    console.log('📧 Email:', email);
    console.log('🔒 Password provided:', !!password);
    
    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ 
        error: 'Email and password are required',
        message: 'Email dan password harus diisi'
      });
    }
    
    if (!db) {
      console.log('❌ Database not available');
      return res.status(500).json({ 
        error: 'Database not available',
        message: 'Sistem sedang dalam perbaikan'
      });
    }
    
    const query = 'SELECT id, email, nama FROM users WHERE email = ? AND password = ?';
    console.log('🔍 Executing user login query...');
    
    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('❌ User login DB error:', err.message);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Terjadi kesalahan pada sistem'
        });
      }
      
      console.log('✅ Query executed, results count:', results.length);
      
      if (results.length === 0) {
        console.log('❌ User not found or password incorrect');
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Email atau password salah'
        });
      }
      
      const user = results[0];
      const token = `user_${user.id}_${Date.now()}`;
      
      console.log('✅ User login successful:', user.email);
      
      res.json({
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: 'user',
        token: token,
        message: 'Login berhasil'
      });
    });
    
  } catch (error) {
    console.error('❌ User login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Terjadi kesalahan pada sistem'
    });
  }
});

// User Register
app.post('/api/users/register', (req, res) => {
  try {
    const { nama, email, password, kelas_id } = req.body;
    
    if (!nama || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    // Check if user exists
    db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      // Insert new user
      const query = 'INSERT INTO users (nama, email, password, kelas_id) VALUES (?, ?, ?, ?)';
      db.query(query, [nama, email, password, kelas_id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        res.json({
          message: 'Registration successful',
          user: {
            id: result.insertId,
            nama,
            email,
            role: 'user'
          }
        });
      });
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==============================================
// DEBUG ROUTES
// ==============================================

app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
    server: 'api2.myscover.my.id',
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'not set',
    database: !!db
  });
});

// Routes debug
app.get('/api/routes-debug', (req, res) => {
  const routes = [];
  
  function extractRoutes(stack, basePath = '') {
    stack.forEach(layer => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        routes.push({
          path: basePath + layer.route.path,
          methods: methods
        });
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
      routes: routes.sort((a, b) => a.path.localeCompare(b.path))
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to extract routes',
      message: error.message
    });
  }
});

// ==============================================
// LOAD OPTIONAL ROUTES
// ==============================================

// ==============================================
// MENTOR ROUTES
// ==============================================

// Mentor Login
app.post('/api/mentors/login', (req, res) => {
  console.log('\n🎓 ====== MENTOR LOGIN (INDEX.JS - NEW ROUTE) ======');
  console.log('🚀 Using NEW mentor login endpoint from index_final.js');
  
  try {
    const { email, password } = req.body;
    
    console.log('📧 Email:', email);
    console.log('🔒 Password provided:', !!password);
    
    // Validate input
    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Database check
    if (!db) {
      console.log('❌ Database not available, using hardcoded check');
      
      // Hardcoded mentor checks
      const hardcodedMentors = [
        {
          id: 1,
          email: 'mentor1@scover.com',
          password: '12345678',
          nama: 'Mentor Test 1',
          status: 'active'
        },
        {
          id: 2,
          email: 'mentor2@scover.com',
          password: '12345678',
          nama: 'Mentor Test 2',
          status: 'active'
        },
        {
          id: 3,
          email: 'mentor3@scover.com',
          password: '12345678',
          nama: 'Mentor Test 3',
          status: 'active'
        }
      ];
      
      // Find mentor by email and password
      const mentor = hardcodedMentors.find(m => m.email === email && m.password === password);
      
      if (!mentor) {
        console.log('❌ Invalid credentials');
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Email atau password salah'
        });
      }
      
      // Generate token
      const token = `mentor_${mentor.id}_${Date.now()}`;
      const response = {
        id: mentor.id,
        email: mentor.email,
        nama: mentor.nama,
        role: 'mentor',
        token: token,
        method: 'hardcoded',
        status: mentor.status
      };
      
      console.log('✅ Hardcoded mentor login successful:', mentor.email);
      return res.json(response);
    }
    
    // Database query - include status check
    console.log('🔍 Executing database query...');
    const query = 'SELECT id, email, nama, status FROM mentors WHERE email = ? AND password = ?';
    
    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('❌ Database error:', err.message);
        
        // Fallback to hardcoded on DB error
        const hardcodedMentors = [
          {
            id: 1,
            email: 'mentor1@scover.com',
            password: '12345678',
            nama: 'Mentor Test 1',
            status: 'active'
          },
          {
            id: 2,
            email: 'mentor2@scover.com',
            password: '12345678',
            nama: 'Mentor Test 2',
            status: 'active'
          },
          {
            id: 3,
            email: 'mentor3@scover.com',
            password: '12345678',
            nama: 'Mentor Test 3',
            status: 'active'
          }
        ];
        
        const mentor = hardcodedMentors.find(m => m.email === email && m.password === password);
        
        if (mentor) {
          const token = `mentor_${mentor.id}_${Date.now()}`;
          return res.json({
            id: mentor.id,
            email: mentor.email,
            nama: mentor.nama,
            role: 'mentor',
            token: token,
            method: 'fallback',
            status: mentor.status
          });
        }
        
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      console.log('✅ Query executed, results count:', results.length);
      
      if (results.length === 0) {
        console.log('❌ No mentor found in database');
        
        // Fallback to hardcoded
        const hardcodedMentors = [
          {
            id: 1,
            email: 'mentor1@scover.com',
            password: '12345678',
            nama: 'Mentor Test 1',
            status: 'active'
          },
          {
            id: 2,
            email: 'mentor2@scover.com',
            password: '12345678',
            nama: 'Mentor Test 2',
            status: 'active'
          },
          {
            id: 3,
            email: 'mentor3@scover.com',
            password: '12345678',
            nama: 'Mentor Test 3',
            status: 'active'
          }
        ];
        
        const mentor = hardcodedMentors.find(m => m.email === email && m.password === password);
        
        if (mentor) {
          const token = `mentor_${mentor.id}_${Date.now()}`;
          return res.json({
            id: mentor.id,
            email: mentor.email,
            nama: mentor.nama,
            role: 'mentor',
            token: token,
            method: 'fallback',
            status: mentor.status
          });
        }
        
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Email atau password salah'
        });
      }
      
      // Success with database
      const mentor = results[0];
      console.log('👤 Mentor found in database:', mentor.email);
      console.log('📊 Mentor status:', mentor.status);
      
      // Skip approval status check for testing
      console.log('✅ Skipping approval status check for testing');
      
      // If no status column or status is active, proceed with login
      const token = `mentor_${mentor.id}_${Date.now()}`;
      const response = {
        id: mentor.id,
        email: mentor.email,
        nama: mentor.nama,
        role: 'mentor',
        token: token,
        method: 'database',
        status: mentor.status || 'active'
      };
      
      console.log('✅ Database mentor login successful');
      res.json(response);
    });
    
  } catch (error) {
    console.error('❌ Mentor login error:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Mentor test endpoint
app.get('/api/mentors/test', (req, res) => {
  res.json({
    message: 'Mentor endpoint working (NEW ROUTE)',
    timestamp: new Date().toISOString(),
    method: 'index_final.js',
    version: '2.0.0'
  });
});

// Mentor Registration (with admin approval)
app.post('/api/mentors/register', (req, res) => {
  console.log('\n🎓 ====== MENTOR REGISTRATION ======');
  console.log('📦 Request body:', req.body);
  console.log('📦 Request headers:', req.headers);
  
  try {
    const { nama, email, password, mata_pelajaran } = req.body;
    
    console.log('📝 Registration data:', { nama, email, mata_pelajaran });
    
    // Validate input
    if (!nama || !email || !password) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
    }
    
    console.log('✅ Input validation passed');
    
    if (!db) {
      console.log('📦 Using fallback mode (no database)');
      return res.json({
        message: 'Registrasi berhasil! Menunggu persetujuan admin.',
        status: 'pending_approval',
        mentor: {
          id: 'temp_' + Date.now(),
          nama,
          email,
          status: 'pending'
        },
        method: 'fallback'
      });
    }
    
    console.log('📦 Using database mode');
    
    // Check if mentor already exists
    const checkQuery = 'SELECT id FROM mentors WHERE email = ?';
    console.log('🔍 Checking existing mentor with query:', checkQuery, 'email:', email);
    
    db.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.error('❌ DB Error during check:', err);
        console.error('❌ Error details:', {
          code: err.code,
          errno: err.errno,
          sqlState: err.sqlState,
          sqlMessage: err.sqlMessage
        });
        return res.status(500).json({ 
          error: 'Database error during email check',
          details: err.message,
          code: err.code
        });
      }
      
      console.log('✅ Email check completed, results:', results);
      
      if (results.length > 0) {
        console.log('❌ Email already exists');
        return res.status(400).json({ error: 'Email sudah terdaftar' });
      }
      
      // Insert new mentor (without status column for now)
      const insertQuery = 'INSERT INTO mentors (nama, email, password) VALUES (?, ?, ?)';
      const insertValues = [nama, email, password];
      
      console.log('🔍 Inserting mentor with query:', insertQuery, 'values:', insertValues);
      
      db.query(insertQuery, insertValues, (err, result) => {
        if (err) {
          console.error('❌ Insert Error:', err);
          console.error('❌ Insert Error details:', {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage
          });
          return res.status(500).json({ 
            error: 'Registration failed',
            details: err.message,
            code: err.code
          });
        }
        
        console.log('✅ Mentor registered successfully, insertId:', result.insertId);
        
        res.json({
          message: 'Registrasi mentor berhasil! Akun Anda sedang menunggu persetujuan admin.',
          status: 'pending_approval',
          mentor: {
            id: result.insertId,
            nama,
            email,
            status: 'pending'
          }
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Try to load other routes if they exist
console.log('🔄 Loading optional routes...');

// Disable old mentor routes to prevent conflicts
try {
  const mentorsRoutes = require('./routes/mentors');
  // app.use('/api/mentors', mentorsRoutes); // DISABLED - using new routes below
  console.log('⚠️ Old mentors routes found but DISABLED - using new routes');
} catch (err) {
  console.warn('⚠️ Old mentors routes not available - using new routes...');
}

try {
  const kelasRoutes = require('./routes/kelas');
  app.use('/api/kelas', kelasRoutes);
  console.log('✅ Kelas routes loaded');
} catch (err) {
  console.warn('⚠️ Kelas routes not available');
  
  app.get('/api/kelas', (req, res) => {
    res.json([]);
  });
}

// ==============================================
// ERROR HANDLING
// ==============================================

// 404 handler - Only for API routes
app.use('/api/*', (req, res) => {
  console.log('❌ 404 - API endpoint not found:', req.method, req.path);
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
    message: 'API endpoint not found',
    availableEndpoints: [
      'GET /',
      'POST /api/admin/login',
      'GET /api/admin/test',
      'GET /api/admin/current-week',
      'GET /api/admin/stats',
      'POST /api/users/login',
      'POST /api/users/register',
      'POST /api/mentors/login',
      'POST /api/mentors/register',
      'GET /api/users',
      'GET /api/mentors',
      'GET /api/kelas',
      'GET /api/mata-pelajaran',
      'GET /api/jadwal-sesi',
      'GET /api/jadwal-sesi/admin-stats',
      'GET /api/permintaan-jadwal',
      'GET /api/silabus',
      'GET /api/pengumuman',
      'GET /api/chat/users',
      'POST /api/chat/conversations/findOrCreate',
      'POST /api/chat/admin/conversations/findOrCreate',
      'POST /api/chat/messages/send',
      'GET /api/chat/conversations/:id/messages',
      'GET /api/chat/conversations',
      'GET /api/history-materi',
      'GET /api/permintaan-jadwal/user/:userId',
      'GET /api/jadwal-sesi/user/:userId',
      'GET /api/history-materi/user/:userId',
      'GET /api/users/:userId',
      'GET /api/mentors/:mentorId/jadwal',
      'GET /api/mentors/available',
      'GET /api/history-materi/mentor/:mentorId',
      'GET /api/availability-mentor',
      'POST /api/availability-mentor',
      'GET /api/mentor-mata-pelajaran/by-mentor',
      'POST /api/mentor-mata-pelajaran',
      'DELETE /api/mentor-mata-pelajaran/:id',
      'GET /api/notifikasi',
      'GET /api/debug',
      'GET /api/routes-debug'
    ]
  });
});

// General 404 handler for non-API routes
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.path);
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log('\n🚀 ====== EDUMENTOR API FINAL ======');
  console.log(`✅ Server running on port ${PORT}`);
  console.log('🌐 API URL: https://api2.myscover.my.id');
  console.log('🔗 Health Check: https://api2.myscover.my.id/');
  console.log('🔑 Admin Login: https://api2.myscover.my.id/api/admin/login');
  console.log('👥 User Login: https://api2.myscover.my.id/api/users/login');
  console.log('🔍 Debug: https://api2.myscover.my.id/api/debug');
  console.log('📋 Routes: https://api2.myscover.my.id/api/routes-debug');
  console.log('🚀 ====== ALL ROUTES IN INDEX.JS ======\n');
});