import React, { useState } from 'react'
import styles from './ReservationModal.module.css';
import { AnimatePresence, motion } from 'framer-motion';

import Calendar from './Calendar';


function ReservationModal({ onClose, onReserve, cabin }) {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const reservas = cabin.reservas;

    const handleSubmit = (event) => {
        event.preventDefault();
        onReserve(cabin.id, startDate, endDate);
    };

    const handleStartDateChange = (event) => {
        const dateStart = new Date(event.target.value);
        if(endDate == '' || new Date(endDate) < dateStart){
            setEndDate(event.target.value);
        }

        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        if(new Date(event.target.value) < new Date(startDate)){
            setStartDate(event.target.value);
        }

        setEndDate(event.target.value);
    };

    return (
        <AnimatePresence>
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeModal} onClick={onClose}>X</button>
                <h2 style={{paddingBottom: '1rem'}}>Reservar {cabin.nombre}</h2>
                <form onSubmit={handleSubmit}>
                    <Calendar setStartDate={setStartDate} setEndDate={setEndDate} />
                    <div className={styles.formReservation}>
                        <label>
                            Fecha de inicio&nbsp;:&nbsp;&nbsp;
                            <span>{startDate}</span>
                        </label>
                        <label>
                            Fecha de fin&nbsp;:&nbsp;&nbsp;
                            <span>{endDate}</span>
                        </label>
                        <button type="submit">Reservar</button>
                        <button onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </motion.div>
        </AnimatePresence>
    );
}

export default ReservationModal;
