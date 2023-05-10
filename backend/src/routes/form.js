const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'cabanaspuconphp@outlook.cl',
        pass: 'cabanasphp2023'
    }
});

// Configuración de la ruta para enviar el correo electrónico
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Configuración del mensaje de correo electrónico
    const mailOptions = {
        from: 'cabanaspuconphp@outlook.cl',
        to: 'vicente.iturrieta1901@alumnos.ubiobio.cl',
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

// Inicio del servidor
app.listen(3000, () => console.log('Servidor iniciado en el puerto 3000'));
