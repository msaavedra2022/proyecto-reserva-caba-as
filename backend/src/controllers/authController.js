// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/models').User;
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while registering the user.' });
    }
};



exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ where: { username } });

    // Check if the user exists and compare the password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Genera el token JWT utilizando la clave secreta (reemplaza 'your_secret_key' con tu propia clave secreta)
      const token = jwt.sign({ userId: user.id, username: user.username }, 'your_secret_key', {
        expiresIn: '1h', // El token expirará en 1 hora
      });

      // Envia el token JWT en la respuesta HTTP
      res.status(200).json({ message: 'Login successful!', token });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while logging in.' });
  }
};
