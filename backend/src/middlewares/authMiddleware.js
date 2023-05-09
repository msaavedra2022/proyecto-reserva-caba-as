const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Obtener el token de autorización de la solicitud
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    // Verificar si se recibió un token
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticación requerido' });
    }
  
    try {
      // Verificar si el token es válido
      const decoded = jwt.verify(token, 'secreto');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Token de autenticación inválido' });
    }
  }

  module.exports = authMiddleware;
