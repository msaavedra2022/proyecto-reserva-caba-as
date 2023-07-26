// Register.js
import React, { useState } from 'react';
import styles from './Register.module.css';


// const server = import.meta.env.VITE_API_URL;
const server = "https://proyecto-reserva-cabanas-production-a736.up.railway.app";


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(server + '/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful registration
        console.log(data.message);
      } else {
        // Handle registration error
        console.error(data.message);
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Bienvenido!</h2>
        <p className={styles.description}>Unete a nosotros y comienza tu viaje hoy.</p> 
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
