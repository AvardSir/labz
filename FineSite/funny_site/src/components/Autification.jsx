
import {  Link } from "react-router-dom"; // Импортируем Link для навигации

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Для навигации и получения данных
import "../css/RegistrationForm.css";

export const Autification = () => {
  const location = useLocation(); // Получаем данные из URL
  const [loginData, setLoginData] = useState({
    login: location.state?.login || "", // Если данные переданы, используем их
    password: location.state?.password || "",
  });
  const [error, setError] = useState(""); // Состояние для ошибок
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для проверки авторизации
  const navigate = useNavigate(); // Инициализация хука для навигации

  const handleLoginChange = ({ target: { name, value } }) => {
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очищаем старые ошибки перед отправкой данных

    // Делаем запрос на сервер для получения списка пользователей и их прав
    try {
      const response = await fetch('/api/users/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      // Проверка на успешный запрос и поиск пользователя с соответствующим login и паролем
      const user = result.find(
        (user) => user.Name === loginData.login && user.Password === loginData.password
      );
      if (user) {
        // Пользователь найден
        setIsLoggedIn(true); // Успешная авторизация
        navigate('/home'); // Перенаправление на домашнюю страницу
      } else {
        setError("Неверный логин или пароль"); // Ошибка авторизации
      }
    } catch (err) {
      setError("Ошибка связи с сервером");
      console.error("Ошибка авторизации:", err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Разлогинивание
    setLoginData({ login: "", password: "" }); // Очистка формы
  };
  const handleLK = () => {
    navigate('/personal_cabinet'); // Переход на страницу личного кабинета
  };
  
  // Автоматически вызываем handleLoginSubmit при передаче данных из регистрации
  useEffect(() => {
    if (loginData.login && loginData.password) {
      handleLoginSubmit(new Event("submit")); // Имитация отправки формы
    }
  }, [loginData, handleLoginSubmit]); // Отправляем форму при изменении данных

  if (isLoggedIn) {
    return (
      <section className="registration">
        <h2>Вы успешно авторизованы!</h2>
        <button onClick={handleLogout}>Выйти</button>
        <button onClick={handleLK}>В личный кабинет</button>

      </section>
    );
  }

  return (
    <section className="registration">
      <h2>Авторизация</h2>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          name="login"
          placeholder="Логин"
          value={loginData.login}
          onChange={handleLoginChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={loginData.password}
          onChange={handleLoginChange}
        />
        <button type="submit">Войти</button>
      </form>
      <div>
  <p>Нет аккаунта? 
    <button style={{
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
      textDecoration: 'none',
      borderRadius: '4px',
    }}>
      <Link to="/registration" style={{
        color: 'inherit', 
        textDecoration: 'none', // Убираем стандартное подчеркивание
      }}>
        Зарегистрируйтесь
      </Link>
    </button>
  </p>
</div>

      {error && <p className="error-message">{error}</p>} {/* Выводим ошибку, если есть */}
    </section>
  );
};
