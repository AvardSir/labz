// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useContext } from "react";

// Создаем контекст
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });
  const [userDetails, setUserDetails] = useState(null); // Состояние для хранения данных о пользователе

  // Логин пользователя
  const login = async (login, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data); // Сохраняем данные пользователя
        setLoginData({ login, password }); // Обновляем loginData
        setIsLoggedIn(true); // Устанавливаем, что пользователь вошел

        // Сохраняем в localStorage
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('login', login);
        localStorage.setItem('password', password);
      } else {
        alert('Неверные логин или пароль');
      }
    } catch (err) {
      console.error('Ошибка при авторизации:', err);
      alert('Ошибка при авторизации');
    }
  };

  // Выход пользователя
  const logout = () => {
    setLoginData({ login: "", password: "" });
    setIsLoggedIn(false);
    setUserDetails(null); // Очищаем данные пользователя
    localStorage.removeItem('user');
    localStorage.removeItem('login');
    localStorage.removeItem('password');
  };

  useEffect(() => {
    // Восстановление данных из localStorage, если они есть
    const savedUser = localStorage.getItem('user');
    const savedLogin = localStorage.getItem('login');
    const savedPassword = localStorage.getItem('password');

    if (savedUser && savedLogin && savedPassword) {
      setUserDetails(JSON.parse(savedUser));
      setLoginData({ login: savedLogin, password: savedPassword });
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, loginData, login, logout, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
