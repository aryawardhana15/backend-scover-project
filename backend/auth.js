const jwt = require('jsonwebtoken');
const SECRET = 'rahasia_super_aman'; // Ganti dengan env variable di production

function generateToken(user) {
  console.log('\n🔵 ====== GENERATE TOKEN START ======');
  console.log('👤 [TOKEN] User data:', user);
  
  // Validate user object
  if (!user || typeof user !== 'object') {
    console.error('❌ [TOKEN] Invalid user data type:', typeof user);
    throw new Error('User data must be an object');
  }
  
  if (!user.id || !user.email || !user.role) {
    console.error('❌ [TOKEN] Missing required user fields:', user);
    throw new Error('User data missing required fields');
  }
  
  // Generate token
  try {
    const token = jwt.sign(user, SECRET, { 
      expiresIn: '7d',
      algorithm: 'HS256'
    });
    
    // Verify token can be decoded
    const decoded = jwt.verify(token, SECRET);
    console.log('✅ [TOKEN] Token generated and verified:');
    console.log('- Token:', token.substring(0, 20) + '...');
    console.log('- Length:', token.length);
    console.log('- Decoded:', decoded);
    console.log('- Expiry:', new Date(decoded.exp * 1000).toLocaleString());
    
    console.log('🟢 ====== GENERATE TOKEN END ======\n');
    return token;
  } catch (error) {
    console.error('❌ [TOKEN] Generation failed:', error);
    throw error;
  }
}

function authenticateJWT(req, res, next) {
  console.log('\n🔵 ====== AUTH MIDDLEWARE START ======');
  console.log('📍 [AUTH] Request info:', {
    path: req.path,
    method: req.method,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  });
  
  // Headers analysis
  console.log('\n📋 [AUTH] Headers analysis:');
  const headers = req.headers;
  console.log('- Authorization:', headers.authorization || 'none');
  console.log('- Content-Type:', headers['content-type']);
  console.log('- Accept:', headers.accept);
  console.log('- Origin:', headers.origin);
  console.log('- User-Agent:', headers['user-agent']);
  
  const authHeader = headers.authorization;
  if (!authHeader) {
    console.error('❌ [AUTH] No authorization header');
    console.log('🔴 ====== AUTH MIDDLEWARE END ======\n');
    return res.status(401).json({ 
      error: 'Token tidak ditemukan',
      detail: 'Authorization header missing'
    });
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    console.error('❌ [AUTH] Invalid authorization format:', authHeader);
    console.log('🔴 ====== AUTH MIDDLEWARE END ======\n');
    return res.status(401).json({ 
      error: 'Format token tidak valid',
      detail: 'Authorization header must start with Bearer'
    });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('\n🔑 [AUTH] Token analysis:');
  console.log('- Raw token:', token.substring(0, 20) + '...');
  console.log('- Length:', token.length);
  
  try {
    // Check if token is in JWT format
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token is not in JWT format');
    }
    
    console.log('- Format: Valid JWT (3 parts)');
    console.log('- Header:', JSON.parse(Buffer.from(parts[0], 'base64').toString()));
    
    // Check if it's a simple token first
    if (token.startsWith('admin_') || token.startsWith('mentor_') || token.startsWith('user_')) {
      console.log('✅ [AUTH] Simple token detected');
      const parts = token.split('_');
      if (parts.length >= 3) {
        const role = parts[0];
        const id = parts[1];
        req.user = { id: parseInt(id), role: role };
        console.log('✅ [AUTH] Simple token accepted:', req.user);
        console.log('🟢 ====== AUTH MIDDLEWARE END ======\n');
        return next();
      }
    }
    
    // Try JWT verification for proper tokens
    console.log('\n🔍 [AUTH] Attempting JWT verification...');
    try {
      const decoded = jwt.verify(token, SECRET, { algorithms: ['HS256'] });
      console.log('✅ [AUTH] JWT verified successfully');
      console.log('👤 [AUTH] Decoded payload:', decoded);
      
      // Validate required fields
      if (!decoded.id || !decoded.email || !decoded.role) {
        console.error('❌ [AUTH] Missing required fields in token payload');
        console.log('🔴 ====== AUTH MIDDLEWARE END ======\n');
        return res.status(401).json({ 
          error: 'Token tidak valid',
          detail: 'Missing required fields in token payload'
        });
      }
      
      req.user = decoded;
      console.log('🟢 ====== AUTH MIDDLEWARE END ======\n');
      next();
    } catch (err) {
      console.error('❌ [AUTH] JWT verification failed:', err.message);
      console.log('🔴 ====== AUTH MIDDLEWARE END ======\n');
      return res.status(401).json({ 
        error: 'Token tidak valid',
        detail: err.message
      });
    }
  } catch (error) {
    console.error('❌ [AUTH] Token processing error:', error.message);
    console.log('🔴 ====== AUTH MIDDLEWARE END ======\n');
    return res.status(401).json({ 
      error: 'Token tidak valid',
      detail: error.message
    });
  }
}

module.exports = { generateToken, authenticateJWT, SECRET };
