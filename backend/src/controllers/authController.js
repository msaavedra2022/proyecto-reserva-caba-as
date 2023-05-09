const User = require('../models/user');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    // Lógica de autenticación aquí
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
      }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
      }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  }
  