import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { SimpleAnalyticsPage } from './SimpleAnalyticsPage';

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
    <div style={{ padding: '20px' }}>
      <h1>Аналитика сайта</h1>
      <SimpleAnalyticsPage />
    </div>
  );
};

export default AnalyticsPage;
