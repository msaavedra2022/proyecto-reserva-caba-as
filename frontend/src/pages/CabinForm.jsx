import React, { useEffect } from 'react'


import styles from './CabinForm.module.css';
import Swal from 'sweetalert2';
import 'animate.css/animate.min.css';

import { AnimatePresence, motion } from 'framer-motion';



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


// Crear cabaña
router.post('/cabanas', (req, res) => {
    Cabana.create(req.body)
        .then(cabana => res.json(cabana))
        .catch(error => res.status(400).json({ error: error.message }));
});

// Editar cabaña
router.put('/cabanas/:id', (req, res) => {
    Cabana.update(req.body, { where: { id: req.params.id } })
        .then(() => res.json({ message: 'Cabaña actualizada con éxito' }))
        .catch(error => res.status(400).json({ error: error.message }));
});


 */


//Formulario (agregar estilos con css), que permite crear/editar una cabaña
export default function CabinForm(props) {
    const { setCabinEdit, edit=true, reload } = props;
    const { id, nombre, imagen, ubicacion, capacidad, precio_por_noche } = props.cabin;

    const [form, setForm] = React.useState({
        id: id || '',
        nombre: nombre || '',
        imagen: imagen || '',
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


    const close = (e) => {
        if(e !== undefined) e.preventDefault();
        setVisible(false);
        setTimeout(() => {
            reload();
            setCabinEdit(null);
        }, 200);
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            id: form.id,
            nombre: form.nombre,
            imagen: form.imagen,
            ubicacion: form.ubicacion,
            capacidad: form.capacidad,
            precio_por_noche: form.precio_por_noche,
        }
        
        if (edit) {
            handleEditCabin(data);
        } else {
            handleCreate(data);
        }
    }

    const handleEditCabin = (data) => {
        fetch(`http://localhost:3000/cabanas/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                Swal.fire('¡Cabaña editada con éxito!', '', 'success').then(() => {
                    close();
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire('¡Error al editar la cabaña!', '', 'error');
            });
    }

    const handleCreate = (data) => {
        fetch('http://localhost:3001/cabanas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                Swal.fire('¡Cabaña creada con éxito!', '', 'success').
                then(() => {
                    close();
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire('¡Error al crear la cabaña!', '', 'error');
            });
    }



    const [visible, setVisible] = React.useState(true);
    return (
        <div  className={styles.cardContainer}>
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
                    <input type="text" name="imagen" onChange={handleChange} value={form.imagen} />
                    <label>Ubicación</label>
                    <input type="text" name="ubicacion" onChange={handleChange} value={form.ubicacion} />
                    <label>Capacidad</label>
                    <input type="text" name="capacidad" onChange={handleChange} value={form.capacidad} />
                    <label>Precio por noche</label>
                    <input type="text" name="precio_por_noche" onChange={handleChange} value={form.precio_por_noche} />
                    <button onClick={handleSubmit}>Guardar</button>
                    <button onClick={close}>Cerrar</button>
                </form>
            </motion.div>}
        </AnimatePresence>
        </div>
    )
}
