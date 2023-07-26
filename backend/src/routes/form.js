const express = require('express');
const router = express.Router();

const transporter = require('../utils/emailTransporter');


// Configuración de la ruta para enviar el correo electrónico
router.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
    // Configuración del mensaje de correo electrónico
    const mailOptions = {
        from: 'miguel.saavedra1601@alumnos.ubiobio.cl',
        to: email,
        subject: 'Nuevo mensaje de bosque de pucón',
        text: `
            Nombre: ${name}\n
            Correo electrónico: ${email}\n
            Mensaje: ${message}
        `
    };

    // Envío del correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Error');
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
            res.send('Éxito');
        }
    });
});

module.exports = router;