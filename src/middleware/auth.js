const { auth } = require('../config/firebase');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requireRole(role) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    try {
      const userRecord = await auth.getUser(req.user.uid);
      const userRole = userRecord.customClaims?.rol;

      if (userRole !== role) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Error al verificar rol' });
    }
  };
}

module.exports = { verifyToken, requireRole };
