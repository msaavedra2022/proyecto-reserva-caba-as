import React, { useState } from "react";
import "./Formulario.css";

function Formulario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comentarios, setComentarios] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Nombre:", nombre);
    console.log("Correo electrónico:", correo);
    console.log("Teléfono:", telefono);
    console.log("Comentarios:", comentarios);
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          required
        />
      </label>
      <label>
        Correo electrónico:
        <input
          type="email"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          required
        />
      </label>
      <label>
        Teléfono:
        <input
          type="tel"
          value={telefono}
          onChange={(event) => setTelefono(event.target.value)}
          required
        />
      </label>
      <label>
        Comentarios:
        <textarea
          value={comentarios}
          onChange={(event) => setComentarios(event.target.value)}
        />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
}

export default Formulario;
