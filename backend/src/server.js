const express = require('express');
const cors = require('cors');

const cabañasRouter = require('./routes/cabanas');


const app = express();

//Middlewares
app.use(cors( { origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/', cabañasRouter);

const port = require('dotenv').config().parsed.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
