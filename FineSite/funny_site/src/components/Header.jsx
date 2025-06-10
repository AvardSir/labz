import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
// import "./Header.css";
import { DropdownLogin } from "./DropdownLogin";
export const Header = () => {
  const { loginData, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // Выход через AuthContext
    navigate("/"); // Переход на главную
  };
  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <h1 className="logo">FunnySite</h1>
      </Link>
      <nav className="navigation">
        <Link to="/" className="nav-link">Главная</Link>
        <Link to="/anecdotes" className="nav-link">Анекдоты</Link>
        <Link to="/events" className="nav-link">Мероприятия</Link>
        <Link to="/AnecdoteGuessGame" className="nav-link">Угадай концовку</Link>
        <Link to="/anecdoteator" className="nav-link">Анекдотатор</Link>
        <DropdownLogin />
        
      </nav>
    </header>
  );
};