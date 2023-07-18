const express = require('express');
const router = express.Router();

const Cabana = require('../models/models').Cabaña;


const transporter = require('../utils/emailTransporter');



// const Usuario = sequelize.define("usuario", {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     nombre: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     apellido: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     celular: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
// });

// const Cabaña = sequelize.define("cabaña", {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     nombre: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     imagen: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     imagenes: {
//         type: Sequelize.ARRAY(Sequelize.STRING),
//         allowNull: false,
//     },
//     ubicacion: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     capacidad: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//     },
//     precio_por_noche: {
//         type: Sequelize.DECIMAL,
//         allowNull: false,
//     },
// });

// const Reserva = sequelize.define("reserva", {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     isConfirmed: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//     },
//     fecha_inicio: {
//         type: Sequelize.DATE,
//         allowNull: false,
//     },
//     fecha_fin: {
//         type: Sequelize.DATE,
//         allowNull: false,
//     },
// });

// Usuario.hasMany(Reserva);
// Reserva.belongsTo(Usuario);

// Cabaña.hasMany(Reserva);
// Reserva.belongsTo(Cabaña);


const datosReserva = `Banco: Banco Estado
Tipo de cuenta: Cuenta corriente
Número de cuenta: 000000000000
Nombre: Cabañas Pucón
RUT: 00000000-0
Correo electrónico: cabañaspucos@gmail.com



`;


// Obtener reservas de una cabaña (confirmadas)
router.get('/cabanas/:id/reservasConfirmadas', (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            cabana.getReservas({ where: { isConfirmed: true } })
                .then(reservas => res.json(reservas))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

// Obtener reservas de una cabaña (no confirmadas)
router.get('/cabanas/:id/reservasNoConfirmadas', (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            cabana.getReservas({ where: { isConfirmed: false } })
                .then(reservas => res.json(reservas))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});


// Crear reserva (no confirmada)
router.post('/cabanas/:id/reservas', (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            cabana.createReserva(req.body)
                .then(reserva => {
                    const fechaInicio = new Date(reserva.fecha_inicio);
                    const fechaFin = new Date(reserva.fecha_fin);
                    const dias = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);

                    const valor = Integer.parseInt(cabana.precio_por_noche * dias);

                    // Enviar email
                    // Configuración del mensaje de correo electrónico
                    const mailOptions = {
                        from: 'cabanaspuconphp@outlook.cl',
                        to: req.body.email,
                        subject: 'Datos pago de reserva Cabañas Pucón',
                        text: `
                            Hola ${req.body.nombre} ${req.body.apellido},\n\n
                            Para confirmar tu reserva debes realizar un depósito de $${valor} a la siguiente cuenta:\n\n
                            ${datosReserva}
                        `
                    };

                    // Envío del correo electrónico
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.send('Error');
                        } else {
                            console.log('Correo electrónico enviado: ' + info.response);
                            res.json(reserva);;
                        }
                    });
                })
                .catch(err => res.status(400).json({ error: err.message }));
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

// Confirmar reserva TODO: Solo el admin puede hacer esto
router.put('/cabanas/:id/reservas/:idReserva', (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            cabana.getReservas({ where: { id: req.params.idReserva } })
                .then(reservas => {
                    reservas[0].update({ isConfirmed: true })
                        .then(reserva => {
                            res.json(reserva);
                        })
                        .catch(err => res.status(400).json({ error: error.message }));
                })
                .catch(err => res.status(400).json({ error: error.message }));
        })
        .catch(err => res.status(400).json({ error: error.message }));
});


//dado un tiempo de inicio y fin, y una cabaña, retorna true si la cabaña esta disponible en ese tiempo
router.get('/cabanas/:id/disponible', (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            cabana.getReservas({ where: { isConfirmed: true, fecha_inicio: { [Op.lte]: req.body.fecha_fin }, fecha_fin: { [Op.gte]: req.body.fecha_inicio } } })
                .then(reservas => {
                    if (reservas.length == 0) {
                        res.json(true);
                    } else {
                        res.json(false);
                    }
                })
                .catch(err => res.status(400).json({ error: error.message }));
        })
        .catch(err => res.status(400).json({ error: error.message }));
});





module.exports = router;
