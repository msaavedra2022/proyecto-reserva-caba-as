import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';


// formData.append("id_reserva", reservaId);
// const url = import.meta.env.VITE_API_URL;
const url = "";


const Comprobante = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const reservaId = params.get('id_reserva');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("reservaId", reservaId);

        console.log("Enviando archivo");

        //Lanzar alerta de que se subio el archivo y se enviará, que dé click en aceptar para continuar
        Swal.fire({
            title: 'Subiendo comprobante',
            text: 'Está seguro que desea subir el comprobante?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, subir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(url+'/upload-comprobante', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                .then(response => {
                    Swal.fire(
                        'El comprobante se subió con éxito',
                        'Recibirá un correo cuando se valide el pago',
                        'success',
                    ).then(() => {
                        window.location.href = "/";
                    });
                })
                .catch(err => {
                    Swal.fire(
                        'Error al subir el comprobante',
                        'El comprobante no se subió',
                        'error'
                    )
                });
                
            }
        });

       
    }, [reservaId])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} style={{border: '1px solid black', padding: '20px', margin: '20px', borderRadius: '10px'}}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Arrastra el comprabante aquí</p> :
                    <p>Puedes arrastrar el comprobante aquí, o hacer click para seleccionar el archivo</p>
            }
        </div>
    )
}

export default Comprobante;
