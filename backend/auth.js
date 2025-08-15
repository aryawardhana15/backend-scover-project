const jwt = require('jsonwebtoken');
const SECRET = 'rahasia_super_aman'; // Ganti dengan env variable di production

function generateToken(user) {
  // user: { id, email, role }
  return jwt.sign(user, SECRET, { expiresIn: '7d' });
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token tidak valid' });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }
}

module.exports = { generateToken, authenticateJWT };
