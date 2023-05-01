const express = require('express');

const cabañasRouter = require('./routes/cabanas');

const cors = require('cors');

const app = express();

// Usar el router en la aplicación
app.use('/', cabañasRouter);

app.use(cors());


//leer variables de entorno
const port = require('dotenv').config().parsed.PORT || 3000;

app.get('/', (req, res) => {
  res.send('¡Hola desde Express!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
