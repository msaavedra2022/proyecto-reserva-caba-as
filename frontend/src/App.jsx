import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './components/footer';
import Nav from './components/nav';
//import Home from './components/home';


import contacto from './pages/contacto';

  return (
    <div className="App">
      <contacto />
    </div>
  );



const App = () => {
  const [cabins, setCabins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('http://localhost:3000/cabanas', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      });
      setCabins(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Cabañas</h1>
      <ul>
        {cabins.map(cabin => (
          <li key={cabin.id}>{cabin.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App

