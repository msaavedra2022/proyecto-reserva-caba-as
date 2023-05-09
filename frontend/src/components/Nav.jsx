import React from 'react';

function Nav(props) {
  const { setPage } = props;


  const clickHandler = (e, page) => {
    e.preventDefault();
    setPage(page);
  };
  
  return (
    <nav>
      <ul>
        <li><a href="/home" onClick={(e) => clickHandler(e, 'Home')}>Home</a></li>
        <li><a href="/reservas" onClick={(e) => clickHandler(e, 'Reservas')}>Reservas</a></li>
        <li><a href="/opiniones" onClick={(e) => clickHandler(e, 'Opiniones')}>Opiniones</a></li>
        <li><a href="/preguntasfrecuentes" onClick={(e) => clickHandler(e, 'PreguntasFrecuentes')}>Preguntas Frecuentes</a></li>
        <li><a href="/contacto" onClick={(e) => clickHandler(e, 'Contacto')}>Contacto</a></li>
        <li><a href="/acerca" onClick={(e) => clickHandler(e, 'Acerca')}>Acerca</a></li>
      </ul>
    </nav>
  );
}

export default Nav;
