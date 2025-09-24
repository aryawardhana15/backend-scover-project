// MINIMAL AUTH - NO EXTERNAL JWT DEPENDENCY

function authenticateJWT(req, res, next) {
  console.log('\n🔐 ====== MINIMAL AUTH START ======');
  console.log('📍 [AUTH] Path:', req.path);
  console.log('📍 [AUTH] Method:', req.method);
  
  const authHeader = req.headers.authorization;
  console.log('🔑 [AUTH] Auth header:', authHeader ? 'present' : 'missing');
  
  if (!authHeader) {
    console.log('❌ [AUTH] No authorization header');
    return res.status(401).json({ 
      error: 'Token tidak ditemukan',
      detail: 'Authorization header missing'
    });
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    console.log('❌ [AUTH] Invalid authorization format');
    return res.status(401).json({ 
      error: 'Format token tidak valid',
      detail: 'Authorization header must start with Bearer'
    });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('🔍 [AUTH] Token:', token ? token.substring(0, 20) + '...' : 'empty');
  
  try {
    // Handle simple tokens only (admin_, mentor_, user_)
    if (token.startsWith('admin_') || token.startsWith('mentor_') || token.startsWith('user_')) {
      console.log('✅ [AUTH] Simple token detected');
      const parts = token.split('_');
      
      if (parts.length >= 3) {
        const role = parts[0];  // admin, mentor, user
        const id = parts[1];    // user id
        
        req.user = { 
          id: parseInt(id), 
          role: role,
          tokenType: 'simple'
        };
        
        console.log('✅ [AUTH] User authenticated:', req.user);
        console.log('🔐 ====== MINIMAL AUTH END ======\n');
        return next();
      }
    }
    
    // If not simple token format, reject
    throw new Error('Token format not supported');
    
  } catch (error) {
    console.error('❌ [AUTH] Token processing error:', error.message);
    return res.status(401).json({ 
      error: 'Token tidak valid',
      detail: error.message
    });
  }
}

// Minimal role checker
function requireRole(requiredRole) {
  return (req, res, next) => {
    console.log('\n🛡️ ====== ROLE CHECK START ======');
    console.log('👤 [ROLE] User:', req.user);
    console.log('🎭 [ROLE] Required:', requiredRole);
    console.log('🎭 [ROLE] User role:', req.user?.role);
    
    if (!req.user) {
      console.log('❌ [ROLE] No user in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (req.user.role !== requiredRole) {
      console.log('❌ [ROLE] Role mismatch');
      return res.status(403).json({ 
        error: 'Access denied',
        required: requiredRole,
        actual: req.user.role
      });
    }
    
    console.log('✅ [ROLE] Role check passed');
    console.log('🛡️ ====== ROLE CHECK END ======\n');
    next();
  };
}

module.exports = { 
  authenticateJWT, 
  requireRole 
};
