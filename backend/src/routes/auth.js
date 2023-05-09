const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'myusername',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
});

const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscamos el usuario en la base de datos
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    // Si el usuario no existe, respondemos con un error
    if (!user) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    // Verificamos la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    // Generamos un token de autenticación
    const token = jwt.sign({ id: user.id }, 'secreto', { expiresIn: '1h' });

    // Enviamos el token como respuesta
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
