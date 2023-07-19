import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';


const url = import.meta.env.VITE_API_URL;

const UnconfirmedReservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        axios.get(url+'/reservasNoConfirmadas')
            .then(res => {
                setReservations(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const confirmReservation = (idCabana, idReserva) => {
        //con aceptar y cancelar
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Una vez confirmada la reserva, no se podrá deshacer la acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Enviando confirmación de reserva...");
                axios.put(url+`/cabanas/${idCabana}/reservas/${idReserva}`)
                    .then(res => {
                        // after successful confirmation, refresh the reservations list
                        // or just update the state to remove the confirmed reservation
                        console.log(res);
                        axios.get(url+'/reservasNoConfirmadas')
                            .then(res => {
                                setReservations(res.data);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }
        });
    };

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0 based
        const year = date.getFullYear();
    
        return `${day}-${month}-${year}`;
    }
    

    return (
        <div>
            <h1>Reservas No Confirmadas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Celular</th>
                        <th>Fecha inicio</th>
                        <th>Fecha fin</th>
                        <th>Cantidad de personas</th>
                        <th>Confirmar</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.id}>
                            <td>{reservation.id}</td>
                            <td>{reservation.nombre}</td>
                            <td>{reservation.email}</td>
                            <td>{reservation.celular}</td>
                            {/* Solo con fecha y sin hora DD-MM-AAAA */}
                            <td>{formatDate(new Date(reservation.fecha_inicio))}</td>
                            <td>{formatDate(new Date(reservation.fecha_fin))}</td>
                            <td>{reservation.cantidad_personas}</td>
                            <td>
                                <button onClick={() => confirmReservation(reservation.cabañaId, reservation.id)}>
                                    Confirmar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UnconfirmedReservations;
