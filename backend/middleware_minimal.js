// MINIMAL MIDDLEWARE - NO EXTERNAL DEPENDENCIES

function requireRole(requiredRole) {
  return (req, res, next) => {
    console.log('\n🛡️ ====== MINIMAL ROLE CHECK ======');
    console.log('👤 User in request:', req.user);
    console.log('🎭 Required role:', requiredRole);
    
    if (!req.user) {
      console.log('❌ No user authenticated');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (req.user.role !== requiredRole) {
      console.log('❌ Role mismatch:', req.user.role, 'vs', requiredRole);
      return res.status(403).json({ 
        error: 'Access denied - insufficient permissions',
        userRole: req.user.role,
        requiredRole: requiredRole
      });
    }
    
    console.log('✅ Role check passed');
    next();
  };
}

function errorHandler(err, req, res, next) {
  console.error('❌ Global error:', err.message);
  console.error('❌ Error stack:', err.stack);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
}

module.exports = {
  requireRole,
  errorHandler
};
