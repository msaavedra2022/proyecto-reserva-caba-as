const express = require('express');
const router = express.Router();

const Cabana = require('../models/models').Cabaña;
const Reserva = require('../models/models').Reserva;

const transporter = require('../utils/emailTransporter');



const email_cabana = 'cabanaspuconphp@outlook.cl'
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


// Obtener todas las reservas no confirmadas
router.get('/reservasNoConfirmadas', (req, res) => {
    Reserva.findAll({
        where: { isConfirmed: false }
    })
    .then(reservas => res.json(reservas))
    .catch(err => console.log(err));
});



const admin_correo = 'cabañas@algo.com';

// Crear reserva (no confirmada)
router.post('/cabanas/:id/reservas', (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            //TODO: Verificar antes que no se cruce con otra fecha de reserva mayor a fecha inicio y menor a fecha fin y el id de la cabaña
            cabana.createReserva(req.body)
                .then(reserva => {
                    const fechaInicio = new Date(reserva.fecha_inicio);
                    const fechaFin = new Date(reserva.fecha_fin);
                    const dias = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
                    
                    //transformar a int
                    const valor = parseInt(cabana.precio_por_noche * dias)
                    console.log("hasya");
                    // Enviar email
                    // Configuración del mensaje de correo electrónico
                    const mailOptions = {
                        from: 'cabanaspuconphp@outlook.cl',
                        to: req.body.email,
                        subject: 'Datos pago de reserva Cabañas Pucón',
                        text: `
                            Hola ${req.body.nombre},\n\n
                            Para confirmar tu reserva debes realizar un depósito de $${valor} a la siguiente cuenta:\n\n
                            ${datosReserva}

                            Cuando realice el deposito de click en el siguiente link para enviar el comprobante su reserva:\n\n
                            ${url}/confirmar-reserva?id_reserva=${reserva.id}\n\n
                        `
                    };

                    // Envío del correo electrónico
                    // transporter.sendMail(mailOptions, (error, info) => {
                    //     if (error) {
                    //         console.log(error);
                    //         res.send('Error');
                    //     } else {
                    //         console.log('Correo electrónico enviado: ' + info.response);
                    //         //Enviar email al admin
                    //         // Configuración del mensaje de correo electrónico
                    //         const mailOptionsAdmin = {
                    //             from:'cabanaspuconphp@outlook.cl',
                    //             to: admin_correo,
                    //             subject: 'Nueva reserva Cabañas Pucón',
                    //             text: `Hola administrador,\n\n
        
                    //             Se ha realizado una nueva reserva en la cabaña ${cabana.nombre}.\n\n
                    //             Datos de la reserva:\n\n
                    //             Nombre: ${req.body.nombre}\n\n
                    //             Apellido: ${req.body.apellido}\n\n
                    //             Email: ${req.body.email}\n\n
                    //             Celular: ${req.body.celular}\n\n
                    //             Fecha de inicio: ${req.body.fecha_inicio}\n\n
                    //             Fecha de término: ${req.body.fecha_fin}\n\n
                    //             Cantidad de personas: ${req.body.cantidad_personas}\n\n
                    //             Valor: $${valor}\n\n
                    //             `
                    //         };
                            
                    //         // Envío del correo electrónico
                    //         // transporter.sendMail(mailOptionsAdmin, (error, info) => {
                    //         //     if (error) {
                    //         //         console.log(error);
                    //         //         res.send('Error');
                    //         //     } else {
                    //         //         console.log('Correo electrónico enviado: ' + info.response);
                    //         //         res.json(reserva);;
                    //         //     }
                    //         // });
                    //     }
                    // });
                    //TODO: Enviar email al admin
                    res.json(reserva);
                })
                .catch(err =>{
                    console.log(err);
                    return res.status(400).json({ error: err.message })
                });

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

                            // Enviar email al cliente
                            const mailOptions = {
                                from: email_cabana,
                                to: reserva.email,
                                subject: 'Reserva confirmada Cabañas Pucón',
                                text: `La reserva de la cabaña ${cabana.nombre} ha sido confirmada.\n\n
                                Datos de la reserva:\n\n
                                Nombre: ${reserva.nombre}\n\n
                                Email: ${reserva.email}\n\n
                                Celular: ${reserva.celular}\n\n
                                Fecha de inicio: ${reserva.fecha_inicio}\n\n
                                Fecha de término: ${reserva.fecha_fin}\n\n
                                Cantidad de personas: ${reserva.cantidad_personas}\n\n`
                            };

                            // Envío del correo electrónico
                            // transporter.sendMail(mailOptions, (error, info) => {
                            //     if (error) {
                            //         console.log(error);
                            //         res.send('Error');
                            //     } else {
                            //         console.log('Correo electrónico enviado: ' + info.response);
                            //     }
                            // });
                            //TODO: Enviar email al admin

                            res.json(reserva);
                        })
                        .catch(err => res.status(400).json({ error: err.message }));
                })
                .catch(err => res.status(400).json({ error: err.message }));
        })
        .catch(err => res.status(400).json({ error: err.message }));
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
                .catch(err => res.status(400).json({ error: err.message }));
        })
        .catch(err => res.status(400).json({ error: err.message }));
});





module.exports = router;
