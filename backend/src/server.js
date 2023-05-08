const express = require('express');
const cors = require('cors');

const cabañasRouter = require('./routes/cabanas');


const app = express();

app.use(cors( { origin: 'http://localhost:5173' }));

// Usar el router en la aplicación
app.use('/', cabañasRouter);


app.get('/', (req, res) => {
  res.send('¡Hola desde Express!');
});

const port = require('dotenv').config().parsed.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
