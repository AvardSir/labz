// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/anecdotes">Анекдоты</Link>
        </li>
        <li>
          <Link to="/events">События</Link>
        </li>
        {!isLoggedIn ? (
          <li>
            <Link to="/registration">Регистрация</Link>
          </li>
        ) : (
          <li>
            <Link to="/personal_cabinet">Личный кабинет</Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button onClick={logout}>Выйти</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
