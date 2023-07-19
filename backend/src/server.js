const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const cabañasRouter = require('./routes/cabanas');
const formRouter = require('./routes/form');
const reservasRouter = require('./routes/reservas');
const authRouter = require('./routes/authRoutes');


const app = express();

//Middlewares
app.use(cors( { origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public/uploads'));
app.use(express.static('public'));
app.use(
  session({
    secret: 'your_secret_key', // Reemplaza por una clave secreta para cifrar las cookies
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Establece en "true" si estás utilizando HTTPS
      httpOnly: true,
    },
  })
);


// Ruta para servir la aplicación React con rutas: '/', '/login','/register', '/reservas','/contacto', '/comprobante','/confirmar-reserva'
const routes_frontend = ['/','/login','/register', '/reservas','/contacto', '/comprobante','/confirmar-reserva'];
for (const route of routes_frontend) {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });
}






//Rutas
app.use('/', formRouter);
app.use('/', cabañasRouter);
app.use('/', reservasRouter);
app.use('/', authRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
