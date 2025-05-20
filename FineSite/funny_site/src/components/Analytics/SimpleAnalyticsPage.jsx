


import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX'); // Замените на ваш реальный ID измерения

export const SimpleAnalyticsPage = () => {
const [stats, setStats] = useState({
    visitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: '00:00:00',
    topPages: []
  });

  useEffect(() => {
    // Track page view
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });

    // Simulate fetching data
    setTimeout(() => {
      setStats({
        visitors: 1234,
        pageViews: 5678,
        bounceRate: 45.6,
        avgSessionDuration: '00:02:30',
        topPages: [
          { url: '/home', views: 3000 },
          { url: '/about', views: 1500 },
          { url: '/contact', views: 1000 }
        ]
      });
    }, 1000);
  }, []);

return (
    <div>
      <h2>Статистика сайта</h2>
      <div>
        <p>Посетители: <strong>{stats.visitors}</strong></p>
        <p>Просмотры страниц: <strong>{stats.pageViews}</strong></p>
        <p>Средний процент отказов: <strong>{stats.bounceRate}%</strong></p>
        <p>Средняя продолжительность сеанса: <strong>{stats.avgSessionDuration}</strong></p>
        <h3>Топ страницы</h3>
        <ul>
          {stats.topPages.map((page, index) => (
            <li key={index}>
              {page.url}: {page.views} просмотров
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
