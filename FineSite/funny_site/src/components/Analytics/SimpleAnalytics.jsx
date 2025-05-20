import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';

export const SimpleAnalytics = () => {
  const [stats, setStats] = useState({
    visitors: 0,
    pageViews: 0
  });

  useEffect(() => {
    // Здесь можно добавить запрос к вашему API
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div>
      <h2>Статистика сайта</h2>
      <div>
        <p>Посетители: <strong>{stats.visitors}</strong></p>
        <p>Просмотры страниц: <strong>{stats.pageViews}</strong></p>
      </div>
    </div>
  );
};