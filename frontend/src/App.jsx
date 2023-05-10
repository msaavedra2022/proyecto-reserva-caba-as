import './App.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './components/Footer';
import Nav from './components/Nav';
import CabinsPage from './pages/CabinsPage';
import Home from './pages/Home';

import ContactoPage from './pages/ContactoPage';

//generar un pequeño router para que se pueda navegar entre las distintas páginas
const App = () => {
  const pages = ['Home', 'Reservas', 'Contacto'];

  const [page, setPage] = useState('Home');

  const setPageHandler = (page) => {
    setPage(page);
  };

  return (
    <div className='app'>
      <Nav setPage={setPageHandler}/>
        {page ==='Reservas' && <CabinsPage />}
        {page ==='Home' && <Home />}
        {page ==='Contacto' && <ContactoPage />}
      <Footer />
    </div>
  );
};


export default App
