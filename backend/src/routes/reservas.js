const express = require('express');
const router = express.Router();
const Sequelize = require("sequelize");
const authMiddleware = require('../middlewares/authMiddleware');


const Cabana = require('../models/models').Cabaña;
const Reserva = require('../models/models').Reserva;

const transporter = require('../utils/emailTransporter');



const email_cabana = "miguel.saavedra1601@alumnos.ubiobio.cl"

const datosReserva = `Banco: Banco Estado
Tipo de cuenta: Cuenta corriente
Número de cuenta: 000000000000
Nombre: Cabañas Pucón
RUT: 00000000-0
Correo electrónico: cabañaspucos@gmail.com



`;

//obtener url del backend (para correo)
const url = "https://proyecto-reserva-cabanas-production-a736.up.railway.app"

const correo_sistem = 'miguel.saavedra1601@alumnos.ubiobio.cl';
const correo_admin = 'miguel12y4@gmail.com';

// Obtener todas las cabañas que no tienen reservas confirmadas entre dos fechas
router.post('/cabanas/disponibles', (req, res) => {
    const fechaInicio = req.body.fechaInicio;
    const fechaFin = req.body.fechaFin;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Se deben proporcionar la fecha de inicio y la fecha de fin' });
    }

    Cabana.findAll({
        include: {
            model: Reserva,
            where: {
                [Sequelize.Op.or]: [
                    { isConfirmed: false },
                    {
                        [Sequelize.Op.or]: [
                            {
                                fecha_inicio: {
                                    [Sequelize.Op.lt]: fechaInicio
                                }
                            },
                            {
                                fecha_fin: {
                                    [Sequelize.Op.gt]: fechaFin
                                }
                            }
                        ]
                    }
                ]
            },
            required: false
        }
    }).then(cabanas => {
        res.json(cabanas);
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});


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

// Verificar si una cabaña tiene reservas asociadas en un rango de fechas
router.post('/cabanas/:id/verificarReservas', (req, res) => {
    Cabana.findByPk(req.params.id)
        .then(cabana => {
            console.log("Backend verificar reservas");
            cabana.getReservas({ where: { fecha_inicio: { [Sequelize.Op.lte]: req.body.fecha_fin }, fecha_fin: { [Sequelize.Op.gte]: req.body.fecha_inicio } } })
                .then(reservas => {
                    if (reservas.length == 0) {
                        res.json({ disponible: true });
                    } else {
                        res.json({ disponible: false });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({ error: err.message })
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: err.message })
        });
});

//en el frontend la request debe quedar:
const body = {
    reservaId: 1,
    fecha_inicio: "2021-06-01",
    fecha_fin: "2021-06-02"
}

//Eliminar reserva cabanas/${idCabana}/reservas/${idReserva}`
router.delete('/cabanas/:idCabana/reservas/:idReserva', authMiddleware, (req, res) => {
    Cabana.findByPk(req.params.idCabana)
        .then(cabana => {
            cabana.getReservas({ where: { id: req.params.idReserva } })
                .then(reservas => {
                    reservas[0].destroy()
                        .then(() => res.sendStatus(200))
                        .catch(err => res.status(400).json({ error: err.message }));
                })
                .catch(err => res.status(400).json({ error: err.message }));
        })
        .catch(err => res.status(400).json({ error: err.message }));
});




//format fecha solo con dia mes y año
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${day}/${month}/${year}`;
}


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
                    // Enviar email
                    // Configuración del mensaje de correo electrónico
                    const mailOptions = {
                        from: correo_sistem,
                        to: req.body.email,
                        subject: 'Datos pago de reserva Cabañas Pucón',
                        text: `
Hola ${req.body.nombre},\n\n
Para confirmar tu reserva debes realizar un depósito de $${valor} a la siguiente cuenta:\n
${datosReserva}

Cuando realice el deposito de click en el siguiente link para enviar el comprobante su reserva:\n
${url}/comprobante?id_reserva=${reserva.id}\n
`
                    };

                    // Envío del correo electrónico
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.send('Error');
                        } else {
                            console.log('Correo electrónico enviado: ' + info.response);
                            //Enviar email al admin
                            // Configuración del mensaje de correo electrónico
                            const mailOptionsAdmin = {
                                from: correo_sistem,
                                to: correo_admin,
                                subject: 'Nueva reserva Cabañas Pucón',
                                text: `Hola administrador,\n\n

Se ha realizado una nueva reserva en la cabaña ${cabana.nombre}.\n
Datos de la reserva:\n
Nombre: ${req.body.nombre}
Email: ${req.body.email}
Celular: ${req.body.celular}
Fecha de inicio: ${formatDate(req.body.fecha_inicio)}
Fecha de término: ${formatDate(req.body.fecha_fin)}
Valor: $${valor}`};
                            
                            // Envío del correo electrónico
                            transporter.sendMail(mailOptionsAdmin, (error, info) => {
                                if (error) {
                                    console.log(error);
                                    res.send('Error');
                                } else {
                                    console.log('Correo electrónico enviado: ' + info.response);
                                    res.json(reserva);;
                                }
                            });
                        }
                    });
                    //TODO: Enviar email al admin
                    // res.json(reserva);
                })
                .catch(err =>{
                    console.log(err);
                    return res.status(400).json({ error: err.message })
                });

        })
        .catch(err => res.status(400).json({ error: err.message }));
});

// Confirmar reserva TODO: Solo el admin puede hacer esto
router.put('/cabanas/:id/reservas/:idReserva', authMiddleware, (req, res) => {
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
Datos de la reserva:
Nombre: ${reserva.nombre}
Email: ${reserva.email}
Celular: ${reserva.celular}
Fecha de inicio: ${formatDate(reserva.fecha_inicio)}
Fecha de término: ${formatDate(reserva.fecha_fin)}`
                            };

                            // Envío del correo electrónico
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error);
                                    res.send('Error');
                                } else {
                                    console.log('Correo electrónico enviado: ' + info.response);
                                }
                            });
                            //TODO: Enviar email al admin

                            // res.json(reserva);
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
