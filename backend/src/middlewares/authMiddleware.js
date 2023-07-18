// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Obtiene el token del encabezado de autorización

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    // Verifica el token JWT utilizando la clave secreta (reemplaza 'your_secret_key' con tu propia clave secreta)
    const decodedToken = jwt.verify(token, 'your_secret_key');

    // Agrega los datos del usuario decodificados al objeto de solicitud para usarlos en las rutas protegidas
    req.userData = { userId: decodedToken.userId, username: decodedToken.username };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
