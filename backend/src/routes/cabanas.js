const express = require('express');
const router = express.Router();
const multer = require('multer');

const Cabana = require('../models/models').Cabaña;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })



// Obtener todas las cabañas
router.get('/cabanas', (req, res) => {
    Cabana.findAll({ order: [['nombre', 'ASC']] })
        .then(cabanas => {
            res.json(cabanas);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

//obtener una cabaña por id
router.get('/cabanas/:id', (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            res.json(cabana);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Crear cabaña
router.post('/cabanas', upload.single('file'), (req, res) => {
    const filename = req.file.filename;
    body = {...req.body, imagen: filename}
    console.log(body);
    Cabana.create(body)
        .then(cabana => res.json(cabana))
        .catch(error => res.status(400).json({ error: error.message }));
});

// Editar cabaña
router.put('/cabanas/:id', upload.single('file'), (req, res) => {
    const filename = req.file.filename;
    body = {...req.body, imagen: filename}
    
    Cabana.update(body, { where: { id: req.params.id } })
        .then(() => res.json({ message: 'Cabaña actualizada con éxito' }))
        .catch(error => res.status(400).json({ error: error.message }));
});


// SOLO PARA PRUEBAS

//Agregar 20 cabañas
router.get('/cabanas-add', (req, res) => {
    console.log('Agregando cabañas');
    let cabañas = [];
    for (let i = 0; i < 9; i++) {
        cabañas.push({
            nombre: `Cabaña ${i}`,
            ubicacion: `Ubicación ${i}`,
            imagen: `https://picsum.photos/seed/${i}/200/300`,
            capacidad: i,
            precio_por_noche: i * 100,
        });
    }
    Cabana.bulkCreate(cabañas)
        .then(cabanas => res.json(cabanas))
        .catch(error => res.status(400).json({ error: error.message }));
});

// Borra todas las cabañas
router.get('/cabanas-delete', (req, res) => {
    Cabana.destroy({ where: {} })
        .then(() => res.json({ message: 'Cabañas borradas con éxito' }))
        .catch(error => res.status(400).json({ error: error.message }));
});


module.exports = router;
