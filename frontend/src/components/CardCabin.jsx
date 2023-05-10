import React, { useState } from 'react'
import CabinForm from '../pages/CabinForm';
import styles from './CardCabin.module.css';


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
    const { setCabinEdit } = props;

    const handleEdit = () => {
        setCabinEdit();
    }
    
    const getImagen = () => {
        if (imagen.includes('https')) {
            return imagen;
        }else return `http://localhost:3000/${imagen}`;
    }
    
    return (
        <div className={styles.card}>
            <div className={styles.cardContainer}>
                <img src={getImagen()} alt={nombre} />
            </div>
            <div className={styles.cardBody}>
                <h3>{nombre}</h3>
                <p>{ubicacion}</p>
                <p>{capacidad} personas</p>
                <p>${precio_por_noche}</p>
                <button>Reservar</button>
                <button onClick={()=>handleEdit()}>Editar</button>
            </div>
        </div>
    )
}