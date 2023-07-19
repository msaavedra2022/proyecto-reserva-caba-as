import React from 'react';

import styles from './Home.module.css';
import { AnimatePresence, motion } from 'framer-motion';


function Home() {
  return (
    <motion.div
    
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.7, opacity: 0 }}
    transition={{ duration: 0.7 }} 
    className={styles.container}>
      <h1 className={styles.title}>Cabañas Bosque de Pucón.</h1>
      <p className={styles.text}>Encuentra la cabaña perfecta para tu próxima escapada</p>
      <form className={styles.form}>
        {/*<label htmlFor="ubicacion">Ubicación:</label>
        <input type="text" id="ubicacion" />*/}
        <label htmlFor="fecha">Fecha de llegada:</label>
        <input type="date" id="fecha" />
        <label htmlFor="dias">Número de días:</label>
        <input type="number" id="dias" min="1" max="30" />
        <button>Buscar</button>
      </form>
    </motion.div>
  );
}

export default Home;
