const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'cabanaspuconphp@outlook.cl',
        pass: 'cabanasphp2023'
    }
});

module.exports = transporter;
