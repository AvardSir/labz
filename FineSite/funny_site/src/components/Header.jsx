import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export const Header = () => {
  const { loginData } = useContext(AuthContext);

  return (
    <header className="header">
      <h1 className="logo">FunnySite</h1>
      <nav className="navigation">
        <Link to="/">Главная</Link>
        <Link to="/anecdotes">Анекдоты</Link>
        <Link to="/events">Мероприятия</Link>
        {loginData && parseInt(loginData.IdRights) === 2 && (
          <Link to="/analytics">Аналитика</Link>
        )}




        {/* <Link to="/LighthouseButton ">LighthouseButton </Link> */}
      </nav>
    </header>
  );
};
