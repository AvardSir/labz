import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// Замените ваш API ключ и URL
const API_KEY = 'I2wg1GxSTOp0JjRQjba5Ol6Kbh2QOJNj'; // Замените на ваш реальный ключ
const API_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers'; // Пример URL для поиска рейсов

const App = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        // Пример параметров запроса, замените на реальные значения
        const response = await axios.get(API_URL, {
          params: {
            originLocationCode: 'NYC', // Код города отправления
            destinationLocationCode: 'LON', // Код города назначения
            departureDate: '2024-09-10', // Дата отправления
            adults: '1', // Количество взрослых
          },
          headers: {
            Authorization: `Bearer ${API_KEY}`, // Ваш API ключ
          },
        });
        setFlights(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flights:', error);
        setError(error);
        setLoading(false);
      }
    };
// console.log('Всем привет')
//TODO: вспомнить что делал
//стоит признать: проект -заброшен
    fetchFlights();
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error loading flights: {error.message}</div>;

  return (
    <div className="container">
      <h1 className="title">Flight Information</h1>
      <div className="flightList">
        {flights.map((flight, index) => (
          <div key={index} className="flightCard">
            <div className="flightInfo">
              <span className="city">{flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[0].arrival.iataCode}</span>
              <span className="time">Departure: {new Date(flight.itineraries[0].segments[0].departure.at).toLocaleTimeString()}</span>
              <span className="time">Arrival: {new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleTimeString()}</span>
              <span className="price">Price: {flight.price.grandTotal}</span>
              <span className="carrier">Carrier: {flight.validatingAirlineCodes.join(', ')}</span>
              <span className="aircraft">Aircraft: {flight.itineraries[0].segments[0].aircraft.code}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
