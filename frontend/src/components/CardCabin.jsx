import React from 'react'


/**
 * 
 * @returns const Cabaña = sequelize.define("cabaña", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    imagen: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ubicacion: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    precio_por_noche: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
});
 */

//Card que muestra la cabaña
export default function cardCabin(props) {
    const { id, nombre, imagen, ubicacion, capacidad, precio_por_noche } = props.cabin;
    return (
        <div className="card">
            <img src={imagen} alt={nombre} />
            <div className="card-body">
                <h3>{nombre}</h3>
                <p>{ubicacion}</p>
                <p>{capacidad} personas</p>
                <p>${precio_por_noche}</p>
                <button>Reservar</button>
            </div>
        </div>
    )
}