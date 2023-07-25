import React from 'react';
import styles from './Nav.module.css';

function Nav(props) {
  const [isLogged, setIsLogged] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLogged(true);
    }
  }, []);

  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li><a href="/">Inicio</a></li>
        <li><a href="/reservas">Cabañas</a></li>
        {/* <li><a href="/opiniones">Información</a></li> */}
        {/*<li><a href="/preguntasfrecuentes" onClick={(e) => clickHandler(e, 'PreguntasFrecuentes')}>Preguntas Frecuentes</a></li>*/}
        <li><a href="/contacto">Contacto</a></li>
        {isLogged ? <li><a href="/acerca">Administración</a></li> : <li><a href="/login">Iniciar Sesión</a></li>}
      </ul>
    </nav>
  );
}

export default Nav;
