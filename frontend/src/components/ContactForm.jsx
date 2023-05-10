import React, { useState } from 'react';
import axios from 'axios';

const Formulario = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        axios.post('/send-email', { name, email, message })
            .then(response => {
                console.log(response.data);
                setStatus('Éxito');
            })
            .catch(error => {
                console.log(error);
                setStatus('Error');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="email">Correo electrónico:</label>
                <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="message">Mensaje:</label>
                <textarea id="message" name="message" value={message} onChange={e => setMessage(e.target.value)} required />
            </div>
            <div>
                <button type="submit">Enviar</button>
            </div>
            {status && <p>{status}</p>}
        </form>
    );
};

export default Formulario;

