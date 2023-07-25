import React, { useState } from 'react';
// import axios from 'axios';
import axios from '../axios';

import styles from './ContactForm.module.css';

const Formulario = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('/send-email', { name, email, message })
            .then((response) => {
                console.log(response.data);
                setStatus('Éxito');
            })
            .catch((error) => {
                console.log(error);
                setStatus('Error');
            });
    };

    return (
        <form onSubmit={handleSubmit} className={styles['form-container']}>
            <div className={styles['form-group']}>
                <label htmlFor="name">Nombre:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={status === 'Éxito' ? `${styles.input} ${styles.success}` : status === 'Error' ? `${styles.input} ${styles.error}` : styles.input}
                />
            </div>
            <div className={styles['form-group']}>
                <label htmlFor="email">Correo electrónico:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={status === 'Éxito'
                        ? `${styles.input} ${styles.success}`
                        : status === 'Error'
                            ? `${styles.input} ${styles.error}`
                            : styles.input}
                />
            </div>
            <div className={styles['form-group']}>
                <label htmlFor="message">Mensaje:</label>
                <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className={status === 'Éxito' ? `${styles.textarea} ${styles.success}` : status === 'Error' ? `${styles.textarea} ${styles.error}` : styles.textarea}
                ></textarea>
            </div>
            <div>
                <button type="submit" className={styles.button}>
                    Enviar
                </button>
            </div>
            {status && <p className={status === 'Éxito' ? `${styles.message} ${styles.success}` : `${styles.message} ${styles.error}`}>{status}</p>}
        </form>
    );
};

export default Formulario;    