const db = require('../config/db');
const { generateToken } = require('../auth');

exports.getAllUsers = (req, res) => {
  db.query('SELECT id, nama, email, foto_profil FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const { nama, email, password, foto_profil } = req.body;
  db.query('INSERT INTO users (nama, email, password, foto_profil) VALUES (?, ?, ?, ?)', [nama, email, password, foto_profil], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ id: result.insertId, nama, email, foto_profil });
  });
};

exports.registerUser = (req, res) => {
  const { nama, email, password, role } = req.body;
  
  // Check if user already exists
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (results.length > 0) return res.status(400).json({ error: 'Email sudah terdaftar' });
    
    // Insert new user (password plain text - sementara)
    db.query('INSERT INTO users (nama, email, password) VALUES (?, ?, ?)', [nama, email, password], (err, result) => {
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
      res.json({ 
        message: 'Registrasi berhasil', 
        user: { id: result.insertId, nama, email, role: 'user' } 
      });
    });
  });
};

exports.loginUser = (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 [LOGIN] Attempting login for:', email);
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Simple login without bcrypt for now
    db.query('SELECT id, email, nama, kelas_id FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
      if (err) {
        console.error('❌ [LOGIN] Database error:', err);
        return res.status(500).json({ error: err.message || 'Database error occurred' });
      }
      
      if (results.length === 0) {
        console.log('❌ [LOGIN] User not found or password incorrect');
        return res.status(401).json({ error: 'Login gagal' });
      }
      
      const user = results[0];
      console.log('✅ [LOGIN] User found:', user.email);
      
      try {
        const userData = { 
          id: user.id, 
          email: user.email, 
          nama: user.nama, 
          kelas_id: user.kelas_id, 
          role: 'user' 
        };
        
        console.log('🔍 [LOGIN] Attempting to generate token for:', userData);
        
        // Generate simple token (bypass JWT issues)
        console.log('🔍 [LOGIN] Generating simple token...');
        const token = 'user_' + userData.id + '_' + Date.now();
        console.log('✅ [LOGIN] Simple token generated:', token);
        res.json({ ...userData, token });
      } catch (tokenError) {
        console.error('❌ [LOGIN] Token generation error:', tokenError);
        console.error('❌ [LOGIN] Error details:', {
          message: tokenError.message,
          stack: tokenError.stack,
          name: tokenError.name
        });
        res.status(500).json({ error: 'Token generation failed: ' + tokenError.message });
      }
    });
  } catch (error) {
    console.error('❌ [LOGIN] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, nama, email, foto_profil FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json({ message: 'User deleted successfully' });
  });
};
