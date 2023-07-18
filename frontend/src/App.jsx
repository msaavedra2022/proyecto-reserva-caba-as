import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CabinsPage from './pages/CabinsPage';
import ContactoPage from './pages/ContactoPage';

import { BrowserRouter } from 'react-router-dom'


        
// Configuración del nuevo router personalizado
let router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/reservas',
    Component: CabinsPage,
  },
  {
    path: '/contacto',
    Component: ContactoPage,
  },
  // Redirección a /login si la ruta no coincide con ninguna definida
  {
    path: '(.*)',
    redirect: '/login',
  },
]);

export default function App() {
  return (
    <div className='app'>
      <Nav />
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      <Footer />
    </div>
  );
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
