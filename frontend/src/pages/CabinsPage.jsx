import React, { useEffect, useState } from 'react'
import axios from 'axios';

import CardCabin from '../components/CardCabin';

import styles from './CabinsPage.module.css';

export default function CabinsPage() {
    const [cabins, setCabins] = useState([]);

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
    }, []);

    //estilos tailwind
    return (
        <div>
            <h1 className="">Cabañas</h1>
            <div className={styles.container}>
            {cabins.map(cabin => (
                <CardCabin key={cabin.id} cabin={cabin} />
            ))}
            </div>
        </div>
    )
}
