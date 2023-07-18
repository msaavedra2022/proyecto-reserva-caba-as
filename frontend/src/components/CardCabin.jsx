import React, { useState } from 'react'
import CabinForm from '../pages/CabinForm';
import styles from './CardCabin.module.css';

import ReservationModal from './ReservationModal';


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

const url = import.meta.env.VITE_API_URL;


export default function cardCabin(props) {
    const { id, nombre, imagenes, ubicacion, capacidad, precio_por_noche } = props.cabin;
    const { setCabinEdit } = props;

    const [activeImage, setActiveImage] = useState(0);

    const [isReservationModalOpen, setReservationModalOpen] = useState(false);


    const handleEdit = () => {
        setCabinEdit();
    }
    
    const getImagenes = () => {
        return imagenes.map(imagen => {
            if (imagen.includes('https')) {
                return imagen;
            } else {
                return `${url}/${imagen}`;
            }
        });
    }
    const handleReserve = async (cabinId, startDate, endDate) => {
        try {
            // Realizar la petición a la API para crear la reserva
            const response = await fetch(`${url}/cabanas/${cabinId}/reservas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fecha_inicio: startDate,
                    fecha_fin: endDate,
                    isConfirmed: false,
                    // Otros datos de la reserva, si es necesario
                })
            });

            if (response.ok) {
                // La reserva se creó correctamente
                setReservationModalOpen(false);
                // Realizar cualquier otra acción necesaria después de la reserva
            } else {
                // Hubo un error al crear la reserva
                console.error('Error al crear la reserva');
                // Manejar el error adecuadamente, mostrar un mensaje de error, etc.
            }
        } catch (error) {
            console.error('Error al realizar la reserva:', error);
            // Manejar el error adecuadamente, mostrar un mensaje de error, etc.
        }
    };

    
    
    return (
        <>
            <div className={styles.card}>
                <div className={styles.cardContainer}>
                    <div className={styles.carousel}>
                        {getImagenes().map((imagen, index) => (
                            <img 
                                key={index} 
                                src={imagen} 
                                alt={nombre} 
                                className={index === activeImage ? '' : styles.hidden} 
                            />
                        ))}
                        <div className={styles.navigation}>
                            <button onClick={() => setActiveImage(prev => (prev - 1 + imagenes.length) % imagenes.length)}>&lt;</button>
                            <button onClick={() => setActiveImage(prev => (prev + 1) % imagenes.length)}>&gt;</button>
                        </div>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <h3>{nombre}</h3>
                    <p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`} target="_blank" rel="noopener noreferrer">{ubicacion}</a></p>
                    <p>{capacidad} personas</p>
                    <p>${precio_por_noche}</p>
                    <button onClick={() => setReservationModalOpen(true)}>Reservar</button>
                    <button onClick={()=>handleEdit()}>Editar</button>
                </div>
            </div>
            {isReservationModalOpen && (
                <ReservationModal
                    onClose={() => setReservationModalOpen(false)}
                    onReserve={handleReserve}
                    cabin={props.cabin}
                />
            )}
        </>
    )
}
