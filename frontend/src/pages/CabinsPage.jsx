import React, { useEffect, useState } from 'react'
import axios from 'axios';

import CardCabin from '../components/CardCabin';

import styles from './CabinsPage.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import CabinForm from './CabinForm';

const url = process.env.VITE_API_URL;



export default function CabinsPage() {
    const [cabins, setCabins] = useState([]);
    const [cabinEdit, setCabinEdit] = useState(null);
    const [cabinAdd, setCabinAdd] = useState(false);
    const [reloadFetch, setReloadFetch] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(`${url}/cabanas`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            });
            setCabins(result.data);
        };
        fetchData();
    }, [reloadFetch]);


    const reload = () => {
        setReloadFetch(!reloadFetch);
    }

    const handleAddCabin = () => {
        setCabinAdd(true);
    }


    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.5 }} 
            
            className={styles.containerCabins  + ' ' +((cabinEdit!=null)?styles.scrollContent:"")} >
            <div className={styles.header}>
                <span className={styles.title}>Cabañas Pucón</span>
                <button className={styles.button} onClick={handleAddCabin}>Agregar Cabaña</button>
            </div>
            {cabinEdit!=null?<CabinForm cabin={cabins[cabinEdit]} close={()=>setCabinEdit(null)} setCabinEdit={setCabinEdit} reload={reload} />:null}
            {cabinAdd?<CabinForm edit={false} cabin={null} close={()=>setCabinAdd(false)} setCabinEdit={setCabinEdit} reload={reload} />:null}

            <div className={styles.container}>
                {cabins.map((cabin, index) => (
                    <CardCabin key={cabin.id} cabin={cabin} setCabinEdit={()=>setCabinEdit(index)} />
                ))}
            </div>
        </motion.div>
    )
}
