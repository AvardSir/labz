import React, { createContext, useState, useEffect } from "react";

// Создаем контекст
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  // Логин пользователя
  const login = (login, password) => {
    setLoginData({ login, password });
    setIsLoggedIn(true);
  };

  // Выход пользователя
  const logout = () => {
    setLoginData({ login: "", password: "" });
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Восстановление данных из localStorage, если они есть
    const savedLogin = localStorage.getItem("login");
    const savedPassword = localStorage.getItem("password");

    if (savedLogin && savedPassword) {
      console.log(savedLogin);
      console.log(savedPassword);
      setLoginData({ login: savedLogin, password: savedPassword });
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("login", loginData.login);
      localStorage.setItem("password", loginData.password);
    } else {
      localStorage.removeItem("login");
      localStorage.removeItem("password");
    }
  }, [isLoggedIn, loginData]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loginData }}>
      {children}
    </AuthContext.Provider>
  );
};
