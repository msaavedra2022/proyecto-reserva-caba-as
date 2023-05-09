import React, { useEffect, useState } from 'react'
import axios from 'axios';

import CardCabin from '../components/CardCabin';

import styles from './CabinsPage.module.css';
import CabinForm from './CabinForm';


export default function CabinsPage() {
    const [cabins, setCabins] = useState([]);
    const [cabinEdit, setCabinEdit] = useState(null);
    const [reloadFetch, setReloadFetch] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios('http://localhost:3000/cabanas', {
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

    return (
        <div className={styles.containerCabins  + ' ' +((cabinEdit!=null)?styles.scrollContent:"")} >
            <h1 className="">Cabañas</h1>
            {cabinEdit!=null?<CabinForm cabin={cabins[cabinEdit]} setCabinEdit={setCabinEdit} reload={reload} />:null}
            <div className={styles.container}>
                {cabins.map((cabin, index) => (
                    <CardCabin key={cabin.id} cabin={cabin} setCabinEdit={()=>setCabinEdit(index)} />
                ))}
            </div>
        </div>
    )
}
