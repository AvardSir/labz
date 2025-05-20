import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';

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
      
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <p>Здесь будет отображаться аналитическая информация.</p>
        <p>
          Для просмотра полной аналитики перейдите в 
          <a 
            href="https://analytics.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ marginLeft: '5px', color: '#1a73e8' }}
          >
            Google Analytics
          </a>
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;