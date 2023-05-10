import React from 'react';
import styles from './Nav.module.css';

function Nav(props) {
  const { setPage } = props;

  const clickHandler = (e, page) => {
    e.preventDefault();
    if(page === 'Home' || page === 'Reservas' || page === 'Contacto') {
      setPage(page);
    }
  };
  
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li><a href="/home" onClick={(e) => clickHandler(e, 'Home')}>Inicio</a></li>
        <li><a href="/reservas" onClick={(e) => clickHandler(e, 'Reservas')}>Reservas</a></li>
        <li><a href="/opiniones" onClick={(e) => clickHandler(e, 'Opiniones')}>Información</a></li>
        {/*<li><a href="/preguntasfrecuentes" onClick={(e) => clickHandler(e, 'PreguntasFrecuentes')}>Preguntas Frecuentes</a></li>*/}
        <li><a href="/contacto" onClick={(e) => clickHandler(e, 'Contacto')}>Contacto</a></li>
        <li><a href="/acerca" onClick={(e) => clickHandler(e, 'Acerca')}>Administración</a></li>
      </ul>
    </nav>
  );
}

export default Nav;
