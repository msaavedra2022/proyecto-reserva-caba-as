import React, { useEffect, useState } from 'react'
// import axios from 'axios';
import axios from '../axios';

import ContactForm from '../components/ContactForm';
import styles from './ContactoPage.module.css';

export default function ContactoPage() {
    return (
        <div>
            <h1>Formulario de contacto</h1>
            <ContactForm />
        </div>
    );
}