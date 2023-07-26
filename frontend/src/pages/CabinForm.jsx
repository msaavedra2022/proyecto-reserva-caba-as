import 'animate.css/animate.min.css';
// import axios from 'axios';

import axios from '../axios';


import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import styles from './CabinForm.module.css';


// const url = import.meta.env.VITE_API_URL;
const url = "";


export default function CabinForm(props) {
    const { setCabinEdit, edit = true, close, reload, add } = props;
    
    let id, nombre, imagen, ubicacion, capacidad, precio_por_noche;

    //inavilitar scroll del body si esta este modal abierto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, []);

    if (edit) {
        id = props.cabin.id;
        nombre = props.cabin.nombre;
        imagen = props.cabin.imagen;
        ubicacion = props.cabin.ubicacion;
        capacidad = props.cabin.capacidad;
        precio_por_noche = props.cabin.precio_por_noche;
    }
    

    const [form, setForm] = React.useState({
        id: id || '',
        nombre: nombre || '',
        imagen: '',
        ubicacion: ubicacion || '',
        capacidad: capacidad || '',
        precio_por_noche: precio_por_noche || '',
    });


    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        setForm({
            ...form,
            [name]: value,
        });
    }

    const handleImageChange = (e) => {
        setForm({
            ...form,
            imagen: e.target.files[0],
        });
    }

    const handleClose = (e) => {
        if (e !== undefined) e.preventDefault();
        setVisible(false);
        setTimeout(() => {
            reload();
            close();
        }, 200);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('ubicacion', form.ubicacion);
        formData.append('capacidad', form.capacidad);
        formData.append('precio_por_noche', form.precio_por_noche);
        formData.append('file', form.imagen);
        console.log("url ", url);
        if (edit) {
            handleEditCabin(formData);
        } else {
            handleCreate(formData);
        }
    }

    const handleEditCabin = (data) => {
        axios.put(`${url}/cabanas/${form.id}`, data)
            .then(response => {
                console.log('Success:', response.data);
                Swal.fire('¡Cabaña editada con éxito!', '', 'success').then(() => {
                    handleClose();
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire('¡Error al editar la cabaña!', '', 'error');
            });
    }

    const handleCreate = (data) => {
        axios.post(`${url}/cabanas`, data)
            .then(response => {
                console.log('Success:', response.data);
                Swal.fire('¡Cabaña creada con éxito!', '', 'success').then(() => {
                    handleClose();
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire('¡Error al crear la cabaña!', '', 'error');
            });
    }

    const [visible, setVisible] = React.useState(true);
    return (
        <div className={styles.cardContainer}>
            <AnimatePresence>
                {visible &&
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                        <form>
                            <h1>Formulario</h1>
                            <label>Nombre</label>
                            <input type="text" name="nombre" onChange={handleChange} value={form.nombre} />
                            <label>Imagen</label>
                            <input type="file" name="file" onChange={handleImageChange} />
                            <label>Ubicación</label>
                            <input type="text" name="ubicacion" onChange={handleChange} value={form.ubicacion} />
                            <label>Capacidad</label>
                            <input type="text" name="capacidad" onChange={handleChange} value={form.capacidad} />
                            <label>Precio por noche</label>
                            <input type="text" name="precio_por_noche" onChange={handleChange} value={form.precio_por_noche} />
                            <button onClick={handleSubmit}>{edit?"Guardar":"Crear"}</button>
                            <button onClick={handleClose}>Cerrar</button>
                        </form>
                    </motion.div>}
            </AnimatePresence>
        </div>
    )
}