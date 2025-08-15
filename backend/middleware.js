// Role-based access control middleware
function requireRole(role) {
  return function (req, res, next) {
    // Asumsi: req.user sudah diisi oleh proses autentikasi (misal JWT, session, dsb)
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Akses ditolak: role tidak sesuai' });
    }
    next();
  };
}

// Bisa juga untuk multi-role
function requireAnyRole(roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Akses ditolak: role tidak sesuai' });
    }
    next();
  };
}

// Error handler standar
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

module.exports = {
  requireRole,
  requireAnyRole,
  errorHandler,
};
