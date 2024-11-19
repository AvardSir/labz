//HomePage.jsx
import React from "react";
import { Header } from "../components/Header"; // Используем именованный импорт
import { Autification } from "../components/Autification"; // Используем именованный импорт
import { SearchSection } from "../components/SearchSection"; // Используем именованный импорт

import "../css/HomePage.css"; // Простой импорт стилей

const HomePage = ({ what = 'anecdote' }) => {
  return (
    <div className="main-container">
      <Header />
      <Autification />
      <SearchSection what={what} />
    </div>
  );
};

export default HomePage;
