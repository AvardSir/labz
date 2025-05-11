// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Создаем контекст
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    login: "",
    IdUser: null,
    password: "",
    IdRights: 1,
  });
  const [userDetails, setUserDetails] = useState(null);

  // Логин пользователя
  const login = async (login, password) => {
    try {
      const response = await fetch('/api/GetUserDetailsByNameAndPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        setLoginData({
          login,
          IdUser: data.IdUser, // Сохраняем IdUser из ответа сервера
          password,
          IdRights: data.IdRights,
        });
        setIsLoggedIn(true);

        // Сохраняем в localStorage
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('login', login);
        localStorage.setItem('password', password);
        localStorage.setItem('IdUser', data.IdUser); // Добавляем IdUser
        localStorage.setItem('IdRights', data.IdRights);
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
    setLoginData({ 
      login: "", 
      IdUser: null, 
      password: "", 
      IdRights: 1 
    });
    setIsLoggedIn(false);
    setUserDetails(null);
    localStorage.removeItem('user');
    localStorage.removeItem('login');
    localStorage.removeItem('password');
    localStorage.removeItem('IdUser'); // Удаляем IdUser
    localStorage.removeItem('IdRights');
  };

  useEffect(() => {
    // Восстановление данных из localStorage
    const savedUser = localStorage.getItem('user');
    const savedLogin = localStorage.getItem('login');
    const savedPassword = localStorage.getItem('password');
    const savedIdUser = localStorage.getItem('IdUser'); // Восстанавливаем IdUser
    const savedIdRights = localStorage.getItem('IdRights');

    if (savedUser && savedLogin && savedPassword && savedIdUser && savedIdRights) {
      setUserDetails(JSON.parse(savedUser));
      setLoginData({
        login: savedLogin,
        IdUser: savedIdUser,
        password: savedPassword,
        IdRights: savedIdRights,
      });
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      loginData, 
      login, 
      logout, 
      userDetails 
    }}>
      {children}
    </AuthContext.Provider>
  );
};