const express = require('express');
const router = express.Router();

const Cabana = require('../models/models').Cabaña;

// Obtener todas las cabañas
router.get('/cabanas', (req, res) => {
    Cabana.findAll()
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
            res.status(400).json({ error: error.message });
        });
});

// Crear cabaña
router.post('/cabanas', (req, res) => {
    Cabana.create(req.body)
        .then(cabana => res.json(cabana))
        .catch(error => res.status(400).json({ error: error.message }));
});

// Editar cabaña
router.put('/cabanas/:id', (req, res) => {
    Cabana.update(req.body, { where: { id: req.params.id } })
        .then(() => res.json({ message: 'Cabaña actualizada con éxito' }))
        .catch(error => res.status(400).json({ error: error.message }));
});


module.exports = router;
