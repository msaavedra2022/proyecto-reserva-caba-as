import React, { useEffect, useState } from 'react'
import styles from './ReservationModal.module.css';
import { AnimatePresence, motion } from 'framer-motion';

// import axios from 'axios';
import axios from '../axios';

import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import Calendar from './Calendar';

// const url = import.meta.env.VITE_API_URL;
const url = ""

function ReservationModal({ onClose, onReserve, cabin }) {

    //inavilitar scroll del body si esta este modal abierto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, []);

    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState(0);

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [celular, setCelular] = useState('');

    const reservas = cabin.reservas;

    useEffect(() => {
        console.log('reservas', reservas);
    }, [reservas]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        //sumar dias a la fecha de inicio
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(days));

        const obj = {
            fecha_inicio: startDate,
            fecha_fin: endDate,
            cabañaId: cabin.id,
            nombre: nombre,
            email: email,
            celular: celular,
        };

        console.log("Verificando reserva...");

        // verficar que no se cruce con otra reserva en /cabanas/:id/verificarReservas
        // axios.post(url + `/cabanas/${cabin.id}/verificarReservas`, obj)

        const res = await axios.post(url + `/cabanas/${cabin.id}/verificarReservas`, obj)

        console.log("res data", res.data);

        if (res?.data?.disponible) {
            // si no se cruza, reservar
            
            onReserve(cabin.id, obj);
        } else {
            if (res?.data?.disponible === false) {

                // si se cruza, mostrar alerta
                Swal.fire({
                    title: 'Error al reservar',
                    text: 'La cabaña ya está reservada en esas fechas',
                    icon: 'error',
                });
            } else {
                // si hay un error, mostrar alerta
                Swal.fire({
                    title: 'Error al reservar',
                    text: 'Hubo un error al reservar la cabaña',
                    icon: 'error',
                });
            }
        }
            
    };

    const handleStartDateChange = (event) => {
        console.log(event.target.value);
        const dateStart = new Date(event.target.value);
        setStartDate(dateStart);
    };

    const handleDaysChange = (event) => {
        console.log(event.target.value);
        setDays(event.target.value);
    };


    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={styles.modal}>
                <div className={styles.modalContent} style={{ maxWidth: '400px', padding: '4rem' }}>
                    <button className={styles.closeModal} onClick={onClose}>X</button>
                    <h2 style={{ paddingBottom: '1rem' }}>Reservar {cabin.nombre}</h2>
                    {/* <form className={styles.form} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onSubmit={handleSubmit}>
                    <label htmlFor="fecha">Fecha de llegada:</label>
                    <br/>
                    <input style={{maxWidth: '300px'}} type="date" id="fecha" onChange={handleStartDateChange} />
                    <label htmlFor="dias">Número de días:</label>
                    <br/>
                    <input style={{maxWidth: '200px'}} type="number" id="dias" min="1" max="30" onChange={handleDaysChange} />
                    <button>Reservar</button>
                </form> */}
                    <div>
                        <h2>Ingrese sus datos para realizar la reserva</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <label htmlFor="nombre">Nombre:</label>
                            <br />
                            <input type="text" id="nombre" onChange={(e) => setNombre(e.target.value)} />
                            <label htmlFor="correo">Correo electrónico:</label>
                            <br />
                            <input type="email" id="correo" onChange={(e) => setEmail(e.target.value)} />
                            <label htmlFor="telefono">Teléfono:</label>
                            <br />
                            <input type="tel" id="telefono" onChange={(e) => setCelular(e.target.value)} />
                            <label htmlFor="fecha">Fecha de llegada:</label>
                            <br />
                            <input type="date" id="fecha" onChange={handleStartDateChange} />
                            <label htmlFor="dias">Número de días:</label>
                            <br />
                            <input type="number" id="dias" onChange={handleDaysChange} />
                            <br />
                            <button type="submit">Reservar</button>
                            <button type="button" onClick={onClose}>Cancelar</button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ReservationModal;
