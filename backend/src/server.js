const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const cabañasRouter = require('./routes/cabanas');
const formRouter = require('./routes/form');


const app = express();

//Middlewares
app.use(cors( { origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public/uploads'));
app.use(express.static('public'));


// Ruta para servir la aplicación React
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});



//Rutas
app.use('/', formRouter);
app.use('/', cabañasRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
