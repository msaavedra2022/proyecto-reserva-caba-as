import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './components/Footer';
import Nav from './components/Nav';
import CabinsPage from './pages/CabinsPage';

const App = () => {
  return (
    <>
      <Nav />
      <CabinsPage />
      <Footer />
    </>
  );
};


export default App
