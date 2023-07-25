const express = require('express');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();
const multer = require('multer');

const Cabana = require('../models/models').Cabaña;
const Reserva = require('../models/models').Reserva;

const transporter = require('../utils/emailTransporter');

const correo_sistem = 'miguel.saavedra1601@alumnos.ubiobio.cl';
const correo_admin = 'miguel12y4@gmail.com';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

//El usuario debe subir el comprobante de pago de la reserva realizada previamente
router.post('/upload-comprobante', upload.single('file'), async (req, res) => {
    const file = req.file;
    const filePath = file.path;
    //recibir del body el id de la reserva
    const reservaId = req.body.reservaId;

    console.log("reservaId: " + reservaId);
    
    //obtener la reserva
    const reserva = await Reserva.findByPk(reservaId);
    if (!reserva || reserva.isUploadedComprobante) {
        return res.status(400).json({ error: 'No existe la reserva' });
    }

    console.log("reserva: " + reserva);
    const email = reserva.email;
    console.log("email: " + email);

    let mailOptions = {
        from: correo_sistem,
        to: correo_admin,
        subject: 'Comprobante de reserva',
        text: `Hola, el usuario ${reserva.nombre}, con email ${reserva.email} ha subido el comprobante de pago de la reserva ${reserva.id}`,
        attachments: [{
            filename: file.originalname,
            path: filePath            
        }]
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            //asignar reserva.isConfirmedComprobante = true
            await reserva.update({ isUploadedComprobante: true });
            console.log('Email sent: ' + info.response);
            fs.unlinkSync(filePath); // delete file after sending
            res.sendStatus(200);
        }
    });
    //TODO: enviar email al usuario con el comprobante de pago
    // res.sendStatus(200);
});


// Obtener todas las cabañas con sus reservas
router.get('/cabanas', (req, res) => {
    Cabana.findAll({ order: [['nombre', 'ASC']], include: 'reservas' })
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
router.post('/cabanas', upload.any('file'), authMiddleware, (req, res) => {
    const filename = req.file.filename;
    body = { ...req.body, imagen: filename, imagenes: [filename] };
    console.log(body);
    Cabana.create(body)
        .then(cabana => res.json(cabana))
        .catch(error => res.status(400).json({ error: error.message }));
});

// Add image to cabaña
router.post('/cabanas/:id/images', authMiddleware, upload.any('file'), (req, res) => {
    const filename = req.file.filename;
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            cabana.imagenes.push(filename);
            cabana.save();
            res.json(cabana);
        })
        .catch(error => res.status(400).json({ error: error.message }));
});

// Borrar imagen de cabaña
router.delete('/cabanas/:id/images/:filename', authMiddleware, (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            cabana.imagenes = cabana.imagenes.filter(imagen => imagen !== req.params.filename);
            cabana.save();
            res.json(cabana);
        })
        .catch(error => res.status(400).json({ error: error.message }));
});

// Editar cabaña
router.put('/cabanas/:id', authMiddleware, (req, res) => {
    const filename = req.file.filename;
    if (filename){
        body = { ...req.body, imagen: filename }
    } else {
        body = { ...req.body }
    }

    Cabana.update(body, { where: { id: req.params.id } })
        .then(() => res.json({ message: 'Cabaña actualizada con éxito' }))
        .catch(error => res.status(400).json({ error: error.message }));
});


// SOLO PARA PRUEBAS

//Agregar 9 cabañas con una reserva cada una
router.get('/cabanas-add', async (req, res) => {
    console.log('Agregando cabañas');
    try {
        // Crear cabañas
        const cabanas = [];
        for (let i = 0; i < 9; i++) {
            cabanas.push({
                nombre: `Cabaña ${i + 1}`,
                imagen: `https://picsum.photos/seed/${i}/200/300`,
                imagenes: [`https://picsum.photos/seed/${i}/200/300`, `https://picsum.photos/seed/${i + 100}/200/300`],
                ubicacion: 'Bariloche',
                capacidad: 4,
                precio_por_noche: 1000,
            });
        }
        console.log("hasta aqui todo bien\n\n\n");
        await Cabana.bulkCreate(cabanas);

        // Obtener todas las cabañas
        const todasCabanas = await Cabana.findAll();
        console.log("hasta aqui todo bien2\n\n\n");
        // Crear reservas para cada cabaña
        const reservaPromises = todasCabanas.map(cabana => {
            return Reserva.create({
                fecha_inicio: '2020-10-01',
                fecha_fin: '2020-10-10',
                isConfirmed: true,
                cabañaId: cabana.id, // Asociar la reserva con la cabaña correspondiente
            });
        });

        await Promise.all(reservaPromises);

        res.json({ message: 'Cabañas agregadas con éxito' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});




// Borra todas las cabañas
router.get('/cabanas-delete', (req, res) => {
    Cabana.destroy({ where: {} })
        .then(() => res.json({ message: 'Cabañas borradas con éxito' }))
        .catch(error => res.status(400).json({ error: error.message }));
});


module.exports = router;
