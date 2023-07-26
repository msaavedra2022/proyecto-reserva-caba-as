import React, { useState } from 'react';
import axios from '../axios';
import CabinsPage from './CabinsPage';

import styles from './Home.module.css';
import { AnimatePresence, motion } from 'framer-motion';

// const url = import.meta.env.VITE_API_URL;
const url = 'https://proyecto-reserva-cabanas-production-a736.up.railway.app';

function Home() {
  const [fecha, setFecha] = useState('');
  const [dias, setDias] = useState('');
  const [searchResults, setSearchResults] = useState(null); // New state for search results

  const buscarCabanas = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Calculate fechaInicio and fechaFin based on fecha and dias
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaInicio.getDate() + parseInt(dias));

    try {
      const response = await axios.post(url + '/cabanas/disponibles', {
        fechaInicio,
        fechaFin,
      });
      const cabanas = response.data;

      setSearchResults(cabanas); // Store the search results in the state

      //lanzar CabinsPage con cabanas como cabins = cabanas
      console.log('fechaInicio: ', fechaInicio, 'fechaFin: ', fechaFin);
      console.log(cabanas);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.7 }}
      className={searchResults ? styles.containerCabins : styles.container}
    >
      {searchResults ? (
        // Render search results using CabinsPage component
        <CabinsPage cabanas={searchResults} statico={true} />
      ) : (
        // Render the search form
        <>
          <h1 className={styles.title}>Cabañas Bosque de Pucón.</h1>
          <p className={styles.text}>Encuentra la cabaña perfecta para tu próxima escapada</p>
          <form className={styles.form} onSubmit={buscarCabanas}>
            <label htmlFor="fecha">Fecha de llegada:</label>
            <input type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <label htmlFor="dias">Número de días:</label>
            <input
              type="number"
              id="dias"
              min="1"
              max="30"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        </>
      )}
    </motion.div>
  );
}

export default Home;
