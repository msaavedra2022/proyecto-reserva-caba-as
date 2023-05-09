import axios from 'axios';

const baseUrl = 'http://localhost:3000'; // La URL base de tu servidor de Node.js

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, { username, password });
    const token = response.data.token;
    localStorage.setItem('token', token); // Almacena el token en el almacenamiento local del navegador
    return token;
  } catch (error) {
    console.error(error);
    throw new Error('Error de autenticación');
  }
};

export const logout = () => {
  localStorage.removeItem('token'); // Elimina el token del almacenamiento local del navegador
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('token'); // Devuelve true si hay un token almacenado en el almacenamiento local del navegador
};
