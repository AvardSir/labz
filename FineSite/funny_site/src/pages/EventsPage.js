// pages/EventsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventsPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('/api/events')
            .then(response => setEvents(response.data))
            .catch(err => console.error('Ошибка загрузки мероприятий:', err));
    }, []);

    return (
        <div>
            <h1>Мероприятия</h1>
            <ul>
                {events.map(event => (
                    <li key={event.IdEvent}>
                        <p><strong>Название:</strong> {event.Name}</p>
                        <p><strong>Описание:</strong> {event.Description}</p>
                        <p><strong>Дата:</strong> {event.Date}</p>
                        <p><strong>Стоимость:</strong> {event.Стоимость}</p>
                        <p><strong>Свободные места:</strong> {event.HowManyFreeSeats}</p>
                        <p><strong>Тип:</strong> {event.ТипМероприятия}</p>
                        <p><strong>Проведено:</strong> {event.Проведено_Строка}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventsPage;
