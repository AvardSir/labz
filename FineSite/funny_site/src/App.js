// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnecdotesPage from './pages/AnecdotesPage';
import EventsPage from './pages/EventsPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/anecdotes" element={<AnecdotesPage />} />
                <Route path="/events" element={<EventsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
