const jwt = require('jsonwebtoken');

const JWT_SECRET = 'rahasia_super_aman';

exports.authenticateToken = (req, res, next) => {
  console.log('🔍 [AUTH] Request path:', req.path);
  console.log('🔍 [AUTH] Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log('🔍 [AUTH] Authorization header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('🔍 [AUTH] Extracted token:', token ? token.substring(0, 20) + '...' : 'none');

  if (!token) {
    console.log('❌ [AUTH] No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  // Check if it's a simple token
  if (token.startsWith('admin-token-') || token.startsWith('mentor-token-') || token.startsWith('temp-token-')) {
    console.log('✅ [AUTH] Using simple token');
    const parts = token.split('-');
    if (parts.length >= 3) {
      const role = parts[0];
      const id = parts[2];
      req.user = { id: parseInt(id), role };
      console.log('✅ [AUTH] Simple token accepted:', req.user);
      return next();
    }
  }

  // Try JWT verification
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('❌ [AUTH] JWT verification failed:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.log('✅ [AUTH] JWT verified successfully:', user);
    req.user = user;
    next();
  });
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    console.log('🔍 [ROLE CHECK] Required role:', role);
    console.log('🔍 [ROLE CHECK] User:', req.user);
    
    if (!req.user) {
      console.log('❌ [ROLE CHECK] No user found in request');
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== role && req.user.role !== 'admin') {
      console.error('❌ [ROLE CHECK] Invalid role. User role:', req.user.role, 'Required:', role);
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    console.log('✅ [ROLE CHECK] Role verified:', req.user.role);
    next();
  };
};
