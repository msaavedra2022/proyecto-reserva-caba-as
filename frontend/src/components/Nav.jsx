import React from 'react';
import styles from './Nav.module.css';

function Nav(props) {
  const { setPage } = props;

  const clickHandler = (e, page) => {
    e.preventDefault();
    if(page === 'Home' || page === 'Reservas') setPage(page);
  };
  
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li><a href="/home" onClick={(e) => clickHandler(e, 'Home')} className={styles.link}>Home</a></li>
        <li><a href="/reservas" onClick={(e) => clickHandler(e, 'Reservas')} className={styles.link}>Reservas</a></li>
        <li><a href="/opiniones" onClick={(e) => clickHandler(e, 'Opiniones')} className={styles.link}>Opiniones</a></li>
        <li><a href="/preguntasfrecuentes" onClick={(e) => clickHandler(e, 'PreguntasFrecuentes')} className={styles.link}>Preguntas Frecuentes</a></li>
        <li><a href="/contacto" onClick={(e) => clickHandler(e, 'Contacto')} className={styles.link}>Contacto</a></li>
        <li><a href="/acerca" onClick={(e) => clickHandler(e, 'Acerca')} className={styles.link}>Acerca</a></li>
      </ul>
    </nav>
  );
}

export default Nav;
