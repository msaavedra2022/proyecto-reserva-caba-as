import React from 'react';
import styles from './Nav.module.css';

function Nav(props) {

  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li><a href="/">Inicio</a></li>
        <li><a href="/reservas">Cabañas</a></li>
        {/* <li><a href="/opiniones">Información</a></li> */}
        {/*<li><a href="/preguntasfrecuentes" onClick={(e) => clickHandler(e, 'PreguntasFrecuentes')}>Preguntas Frecuentes</a></li>*/}
        <li><a href="/contacto">Contacto</a></li>
        <li><a href="/acerca">Administración</a></li>
      </ul>
    </nav>
  );
}

export default Nav;
