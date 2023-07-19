// Login.js
import React, { useState } from 'react';
import styles from './Login.module.css';


const server = import.meta.env.VITE_API_URL;
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(server + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        console.log(data.message);
        //Guardar el token en el local storage
        localStorage.setItem('token', data.token);
        // Redirigir a la página de inicio 
        window.location.href = '/';
      } else {
        // Handle login error
        console.error(data.message);
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.card}>
      <h2 className={styles.title}>Bienvenido</h2>
      <p className={styles.description}>Inicia sesión para continuar</p>
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
        <button type="submit" className={styles.button}>Iniciar sesión</button>
      </form>
      <a href="/register" className={styles.signUp}>No tienes cuenta? Registrate</a>
    </div>
  </div>
  );
};

export default Login;
