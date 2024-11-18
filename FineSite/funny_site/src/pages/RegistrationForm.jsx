import React, { useState } from "react";
import "../css/RegistrationForm.css";

export const RegistrationForm = () => {
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState(""); // Состояние для ошибок
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для проверки авторизации

  const handleLoginChange = ({ target: { name, value } }) => {
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очищаем старые ошибки перед отправкой данных

    // Делаем запрос на сервер для получения списка пользователей и их прав
    try {
      const response = await fetch('http://localhost:5000/api/users/rights', {
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

  if (isLoggedIn) {
    return (
      <section className="registration">
        <h2>Вы успешно авторизованы!</h2>
        <button onClick={handleLogout}>Выйти</button>
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

      {error && <p className="error-message">{error}</p>} {/* Выводим ошибку, если есть */}
    </section>
  );
};
