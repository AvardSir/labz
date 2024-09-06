import logo from './logo.svg';
// import './App.css';
import './index.css'; // Импортируем наш CSS файл

import React, { useState } from 'react';

// Данные для авиаперелетов (замените на реальные данные или API)
const flightsData = [
  { id: 1, from: "New York", to: "London", time: "14:00", price: "$500" },
  { id: 2, from: "Paris", to: "Tokyo", time: "09:30", price: "$650" },
  { id: 3, from: "Berlin", to: "Moscow", time: "18:45", price: "$300" },
  { id: 4, from: "Sydney", to: "Dubai", time: "21:15", price: "$750" },
];

const App = () => {
  const [flights, setFlights] = useState(flightsData);

  return (
    <div className="container">
      <h1 className="title">Flight Search</h1>
      <div className="flight-list">
        {flights.map(flight => (
          <div key={flight.id} className="flight-card">
            <div className="flight-info">
              <span className="city">{flight.from} → {flight.to}</span>
              <span className="time">Departure: {flight.time}</span>
              <span className="price">{flight.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
