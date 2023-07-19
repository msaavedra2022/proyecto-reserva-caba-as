// Login.js
import React, { useState } from 'react';

const server = 'http://localhost:3000';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(server+'/login', {
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
