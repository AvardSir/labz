import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">Фиолетовый портал</h1>
      <nav className="navigation">
        <a href="/">Главная</a>
        <a href="/anecdotes">Анекдоты</a>
        <a href="/events">Мероприятия</a>
      </nav>
    </header>
  );
};

  