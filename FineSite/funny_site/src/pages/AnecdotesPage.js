// pages/AnecdotesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';  // Подключаем стили из HomePage.css

const AnecdotesPage = () => {
    const [anecdotes, setAnecdotes] = useState([]);

    useEffect(() => {
        axios.get('/api/anecdotes')
            .then(response => setAnecdotes(response.data))
            .catch(err => console.error('Ошибка загрузки анекдотов:', err));
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
                <h1>Анекдоты</h1>
                <ul>
                    {anecdotes.map(anecdote => (
                        <li key={anecdote.IdAnecdote}>
                            <p><strong>Текст:</strong> {anecdote.Text}</p>
                            <p><strong>Дата:</strong> {anecdote.Date}</p>
                            <p><strong>Рейтинг:</strong> {anecdote.Rate}</p>
                            <p><strong>Автор:</strong> {anecdote.UserName}</p>
                            <p><strong>Тип:</strong> {anecdote.AnecdoteType}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AnecdotesPage;
