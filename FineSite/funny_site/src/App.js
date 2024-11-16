// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnecdotesPage from './pages/AnecdotesPage';
import EventsPage from './pages/EventsPage';
import HomePage from './pages/HomePage'; // Импортируем компонент для главной страницы

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/anecdotes" element={<AnecdotesPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/" element={<HomePage />} />

            </Routes>
        </Router>
    );
}

export default App;
