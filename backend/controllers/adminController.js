const db = require('../config/db');
const { getWeekNumber } = require('../utils/dateUtils');

exports.getAllAdmin = (req, res) => {
  db.query('SELECT * FROM admin', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.loginAdmin = (req, res) => {
  console.log('\n🚀 ====== ADMIN LOGIN START ======');
  
  try {
    const { email, password } = req.body;
    
    console.log('🔍 [ADMIN LOGIN] Request details:');
    console.log('- Email:', email);
    console.log('- Password provided:', !!password);
    console.log('- Request method:', req.method);
    console.log('- Content-Type:', req.headers['content-type']);
    
    // Validate input
    if (!email || !password) {
      console.log('❌ [ADMIN LOGIN] Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Test database connection first
    console.log('🔍 [ADMIN LOGIN] Testing database connection...');
    db.query('SELECT 1 as test', (testErr, testResults) => {
      if (testErr) {
        console.error('❌ [ADMIN LOGIN] Database connection failed:', testErr);
        return res.status(500).json({ error: 'Database connection failed' });
      }
      
      console.log('✅ [ADMIN LOGIN] Database connection OK');
      
      // Now try actual login query
      console.log('🔍 [ADMIN LOGIN] Executing login query...');
      db.query('SELECT id, email FROM admin WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
          console.error('❌ [ADMIN LOGIN] Database query error:', err);
          return res.status(500).json({ error: 'Database query failed: ' + err.message });
        }
        
        console.log('✅ [ADMIN LOGIN] Query executed successfully');
        console.log('🔍 [ADMIN LOGIN] Results count:', results.length);
        
        if (results.length === 0) {
          console.log('❌ [ADMIN LOGIN] Admin not found or password incorrect');
          return res.status(401).json({ error: 'Login gagal' });
        }
        
        const user = results[0];
        console.log('✅ [ADMIN LOGIN] Admin found:', JSON.stringify(user));
        
        // Generate token with maximum safety
        console.log('🔍 [ADMIN LOGIN] Starting token generation...');
        
        try {
          // Prepare user data step by step
          console.log('📝 [ADMIN LOGIN] Step 1: Extract user ID...');
          const userId = user.id;
          console.log('- User ID:', userId, typeof userId);
          
          console.log('📝 [ADMIN LOGIN] Step 2: Extract user email...');
          const userEmail = user.email;
          console.log('- User email:', userEmail, typeof userEmail);
          
          console.log('📝 [ADMIN LOGIN] Step 3: Generate timestamp...');
          const timestamp = Date.now();
          console.log('- Timestamp:', timestamp, typeof timestamp);
          
          console.log('📝 [ADMIN LOGIN] Step 4: Create token string...');
          const token = 'admin_' + userId + '_' + timestamp;
          console.log('- Token:', token, typeof token);
          
          console.log('📝 [ADMIN LOGIN] Step 5: Prepare user data object...');
          const userData = {
            id: userId,
            email: userEmail,
            role: 'admin'
          };
          console.log('- User data:', JSON.stringify(userData));
          
          console.log('📝 [ADMIN LOGIN] Step 6: Create response object...');
          const response = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            token: token
          };
          console.log('- Response:', JSON.stringify(response));
          
          console.log('📝 [ADMIN LOGIN] Step 7: Send response...');
          res.json(response);
          
          console.log('✅ [ADMIN LOGIN] SUCCESS - Response sent');
          console.log('🚀 ====== ADMIN LOGIN END ======\n');
          
        } catch (tokenError) {
          console.error('❌ [ADMIN LOGIN] Token generation error:', tokenError);
          console.error('❌ [ADMIN LOGIN] Error type:', typeof tokenError);
          console.error('❌ [ADMIN LOGIN] Error constructor:', tokenError.constructor.name);
          console.error('❌ [ADMIN LOGIN] Error message:', tokenError.message);
          console.error('❌ [ADMIN LOGIN] Error stack:', tokenError.stack);
          res.status(500).json({ 
            error: 'Token generation failed', 
            details: tokenError.message,
            type: typeof tokenError
          });
        }
      });
    });
    
  } catch (outerError) {
    console.error('❌ [ADMIN LOGIN] Outer catch error:', outerError);
    console.error('❌ [ADMIN LOGIN] Outer error type:', typeof outerError);
    console.error('❌ [ADMIN LOGIN] Outer error stack:', outerError.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: outerError.message 
    });
  }
};

exports.createAdmin = (req, res) => {
  const { nama, email, password } = req.body;
  db.query('INSERT INTO admin (nama, email, password) VALUES (?, ?, ?)', [nama, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ id: result.insertId, nama, email });
  });
};

exports.getCurrentWeek = (req, res) => {
  const today = new Date();
  const weekNumber = getWeekNumber(today);
  res.json({ weekNumber });
};

exports.getStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users) AS total_user,
      (SELECT COUNT(*) FROM mentors) AS total_mentor,
      (SELECT COUNT(*) FROM kelas) AS total_kelas,
      (SELECT COUNT(*) FROM jadwal_sesi WHERE status = 'scheduled') AS total_sesi_scheduled,
      (SELECT COUNT(*) FROM permintaan_jadwal WHERE status = 'pending') AS total_permintaan_pending,
      (SELECT COUNT(*) FROM mata_pelajaran) AS total_mapel;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results[0]);
  });
};

exports.getAllUsers = (req, res) => {
  db.query('SELECT id, nama, email FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.getAllMentors = (req, res) => {
  db.query('SELECT id, nama, email FROM mentors', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};
