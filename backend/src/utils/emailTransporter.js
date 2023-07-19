const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // user: 'cabanaspuconphp@outlook.cl',
        user: 'miguel.saavedra1601@alumnos.ubiobio.cl',
        pass: '4#d#5Ce2-3'
    }
});

module.exports = transporter;
