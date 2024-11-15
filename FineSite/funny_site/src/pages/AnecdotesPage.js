// pages/AnecdotesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnecdotesPage = () => {
    const [anecdotes, setAnecdotes] = useState([]);

    useEffect(() => {
        axios.get('/api/anecdotes')
            .then(response => setAnecdotes(response.data))
            .catch(err => console.error('Ошибка загрузки анекдотов:', err));
    }, []);

    return (
        <div>
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
    );
};

export default AnecdotesPage;
