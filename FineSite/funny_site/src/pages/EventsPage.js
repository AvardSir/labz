// pages/EventsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css'; // Подключаем общий стиль

const EventsPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('/api/events')
            .then(response => setEvents(response.data))
            .catch(err => console.error('Ошибка загрузки мероприятий:', err));
    }, []);

    return (
        <div className="main-container">
            {/* Шапка */}
            <header className="header">
                <h1 className="logo">Фиолетовый портал</h1>
                <nav className="navigation">
                    <a href="/">Главная</a>
                    <a href="/anecdotes">Анекдоты</a>
                    <a href="/events">Мероприятия</a>
                </nav>
            </header>

            {/* Боковая панель */}
            <div className="sidebar">
                <div className="registration">
                    <h2>Регистрация</h2>
                    <form>
                        <input type="text" placeholder="Имя" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Пароль" />
                        <button type="submit">Зарегистрироваться</button>
                    </form>
                </div>

                <div className="search">
                    <h2>Поиск</h2>
                    <div className="search-options">
                        <div className="search-box">
                            <h3>По типу анекдота</h3>
                            <input type="text" placeholder="Введите тип..." />
                        </div>
                        <div className="search-box">
                            <h3>По типу мероприятия</h3>
                            <input type="text" placeholder="Введите тип..." />
                        </div>
                    </div>
                </div>
            </div>

            {/* Основной контент */}
            <div className="content">
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
        </div>
    );
};

export default EventsPage;
