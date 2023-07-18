import React, { useState } from 'react';
import styles from './Calendar.module.css';

const Calendar = ({setStartDate, setEndDate}) => {
    const [date, setDate] = useState(new Date());
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);

    const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    let daysArray = new Array((firstDayOfMonth + 6) % 7).fill(null).concat([...Array(daysInMonth).keys()].map((i) => i + 1));

    const handlePrevMonth = (event) => {
        event.preventDefault();
        setDate((prevState) => new Date(prevState.getFullYear(), prevState.getMonth() - 1));
    };

    const handleNextMonth = (event) => {
        event.preventDefault();
        setDate((prevState) => new Date(prevState.getFullYear(), prevState.getMonth() + 1));
    };

    const handleDayClick = (day) => {
        const clickedDate = new Date(date.getFullYear(), date.getMonth(), day);
        const today = new Date();
        if(clickedDate.getTime() < today.getTime()) {
            if(clickedDate.day === today.day && clickedDate.month === today.month && clickedDate.year === today.year) {
                // console.log("Today");
            }else{
                return;
            }
        }

        if (!selectedFromDate) {
            setSelectedFromDate(clickedDate);
            setStartDate(clickedDate.toDateString());
            setSelectedToDate(null);
            setEndDate('');
        }else if (!selectedToDate) {
            if (clickedDate >= selectedFromDate) {
                setSelectedToDate(clickedDate);
                setEndDate(clickedDate.toDateString());
            } else {
                setSelectedFromDate(clickedDate);
                setStartDate(clickedDate.toDateString());
                setSelectedToDate(null);
                setEndDate('');
            }
        } else if (selectedFromDate && selectedToDate && clickedDate > selectedToDate) {
            setSelectedToDate(clickedDate);
            setEndDate(clickedDate.toDateString());
        } else if (selectedFromDate && selectedToDate && clickedDate < selectedToDate && clickedDate >= selectedFromDate) {
            setSelectedToDate(clickedDate);
            setEndDate(clickedDate.toDateString());
        } else {
            setSelectedFromDate(clickedDate);
            setStartDate(clickedDate.toDateString());
            setSelectedToDate(null);
            setEndDate('');
        }
    };

    const handleReset = (event) => {
        event.preventDefault();
        setSelectedFromDate(null);
        setStartDate('');
        setSelectedToDate(null);
        setEndDate('');

        //reset calendar
        setDate(new Date());
    };


    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <button onClick={handlePrevMonth}>&lt;</button>
                <h2>{monthNames[date.getMonth()]} {date.getFullYear()}</h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className={styles.body}>
                {weekdays.map((day, i) => (
                    <div key={i} className={styles.dayName}>
                        {day}
                    </div>
                ))}
                {daysArray.map((day, i) => {
                    if (day === null) {
                        return <div key={i} className={styles.emptyDay}></div>;
                    }
                    let today = new Date();
                    let isToday =
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear() &&
                        day === today.getDate();

                    let dayDate = new Date(date.getFullYear(), date.getMonth(), day);
                    let isMarked =
                        selectedFromDate &&
                        selectedToDate &&
                        dayDate >= selectedFromDate &&
                        dayDate <= selectedToDate &&
                        date.getMonth() === dayDate.getMonth() &&
                        date.getFullYear() === dayDate.getFullYear();

                    isMarked = isMarked || (selectedFromDate && !selectedToDate && selectedFromDate.getTime() === dayDate.getTime());

                    return (
                        <div
                            key={i}
                            className={
                                (isToday && !isMarked
                                    ? styles.today
                                    : isMarked
                                        ? styles.markedDay
                                        : day
                                            ? styles.day
                                            : styles.emptyDay) + ' ' + styles.btnDay
                            }
                            onClick={() => handleDayClick(day)}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
            <button onClick={(e) =>handleReset(e)} >Reset</button>
        </div>
    );
};

export default Calendar;
