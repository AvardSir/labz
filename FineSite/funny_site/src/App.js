// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnecdotesPage from './pages/AnecdotesPage';
import EventsPage from './pages/EventsPage';
import HomePage from './pages/HomePage'; // Импортируем компонент для главной страницы

import RegistrationPage from './pages/RegistrationPage'; // Импортируем компонент для главной страницы



// App.js
import PersonalCabinet from './pages/PersonalCabinet'; // Импортируем компонент по умолчанию


function App() {
    return (
        <Router>
            <Routes>

                <Route path="/anecdotes" element={<AnecdotesPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/registration" element={<RegistrationPage />} />

                <Route path="/personal_cabinet" element={<PersonalCabinet/>} />
                
            </Routes>
        </Router>
    );
}

export default App;
