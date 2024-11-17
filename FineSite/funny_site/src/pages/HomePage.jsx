import React from "react";
import { Header } from "./Header"; // Используем именованный импорт
import { RegistrationForm } from "./RegistrationForm"; // Используем именованный импорт
import { SearchSection } from "./SearchSection"; // Используем именованный импорт

import "../css/HomePage.css"; // Простой импорт стилей

const HomePage = ({ what = 'anecdote' }) => {
  return (
    <div className="main-container">
      <Header />
      <RegistrationForm />
      <SearchSection what={what} />
    </div>
  );
};

export default HomePage;
