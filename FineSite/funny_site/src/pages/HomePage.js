import React, { useState } from "react";
import { Link } from "react-router-dom";
import './HomePage.css';

const HomePage = () => {
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [searchData, setSearchData] = useState({
    anecdote: "",
    event: "",
  });

  // Обработчики для регистрации
  const handleRegistrationChange = ({ target: { name, value } }) => {
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    console.log("Регистрация:", registrationData);
    // Здесь можно добавить API-запрос для отправки данных
  };

  // Обработчики для поиска
  const handleSearchChange = ({ target: { name, value } }) => {
    setSearchData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearch = async () => {
    const { anecdote } = searchData; // Получаем значение для поиска
    try {
        // Выполняем запрос к серверу с параметром idTypeAnecdote
        const response = await fetch(`/api/anecdotes/by-type?idTypeAnecdote=${encodeURIComponent(anecdote)}`);
        const result = await response.json();

        if (result.length > 0) {
            
            console.log("Найденные анекдоты:", result);
            
        } else {
            console.log("Анекдоты не найдены.");
        }
    } catch (error) {
        console.error("Ошибка при поиске анекдотов:", error);
    }
};



  // Компонент для регистрации
  const RegistrationForm = () => (
    <section className="registration">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegistrationSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={registrationData.name}
          onChange={handleRegistrationChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registrationData.email}
          onChange={handleRegistrationChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={registrationData.password}
          onChange={handleRegistrationChange}
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </section>
  );

  // Компонент для поиска
  const SearchSection = () => (
    <section className="search">
      <h2>Поиск</h2>
      <div className="search-options">
        <div className="search-box">
          <h3>По типу анекдота</h3>
          <input
            type="text"
            name="anecdote"
            placeholder="Введите тип..."
            value={searchData.anecdote}
            onChange={handleSearchChange}
          />
        </div>
        <div className="search-box">
          <h3>По типу мероприятия</h3>
          <input
            type="text"
            name="event"
            placeholder="Введите тип..."
            value={searchData.event}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <button onClick={handleSearch}>Искать</button>
    </section>
  );

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <h1 className="logo">Фиолетовый портал</h1>
        <nav className="navigation">
          <Link to="/home">Главная</Link>
          <Link to="/anecdotes">Анекдоты</Link>
          <Link to="/events">Мероприятия</Link>
        </nav>
      </header>

      {/* Регистрация */}
      <RegistrationForm />

      {/* Поиск */}
      
      <SearchSection />
    </div>
  );
};

export default HomePage;
