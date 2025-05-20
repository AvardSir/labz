import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { SimpleAnalyticsPage } from './SimpleAnalyticsPage';
// import { Header } from "../../Header.jsx";
// import { RegistrationForm } from "../../Autification.jsx";
// import { SearchSection } from "../../SearchSection.jsx";
// import { FoundAnecdotes } from "../../FoundAnecdotes.jsx";
import HomePage from "../../pages/HomePage";
import { Header } from '../Header';

// import HomePage.css from "../css/HomePage.css";

export const  AnalyticsPage = () => {
  useEffect(() => {
    // Инициализация Google Analytics 4
    ReactGA.initialize('G-XXXXXXXXXX'); // Замените на ваш реальный ID измерения

    // Отправка данных о просмотре страницы
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname + window.location.search
    });
  }, []);

return (
    <div >
      <Header />
      {/* <HomePage /> */}
      <h1>Аналитика сайта</h1>
      <SimpleAnalyticsPage />
    </div>
  );
};

export default AnalyticsPage;

