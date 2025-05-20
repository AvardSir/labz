import React from 'react';
// import AnecdoteDateRatingChart from './AnecdoteDateRatingChart'; // Твой график по датам
import { AverageRatingChart } from './AverageRatingChart';
import { AnecdoteTypeRatingChart } from './AnecdoteTypeRatingChart'; // График по типам анекдотов
// import AnecdoteDateRatingChart
import { TopUsersAvgRatingChart } from './TopUsersAvgRatingChart';
import { TopUsersByAnecdotesChart } from './TopUsersByAnecdotesChart';
const AnalyticsPage = () => {
  return (
    <div className="container mx-auto p-4 space-y-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Аналитика анекдотов</h1>

      <section>
        {/* <h2 className="text-xl font-semibold mb-4">Рейтинг анекдотов по датам</h2> */}
        <AverageRatingChart />
      </section>

      <section>
        {/* <h2 className="text-xl font-semibold mb-4">Рейтинг анекдотов по типам</h2> */}
        <AnecdoteTypeRatingChart />
      </section>

      <section>
        {/* <h2 className="text-xl font-semibold mb-4">Топ пользователей по среднему рейтингу</h2> */}
        <TopUsersAvgRatingChart />
      </section>
      <section>
        {/* <h2 className="text-xl font-semibold mb-4">Топ пользователей по среднему рейтингу</h2> */}
        <TopUsersByAnecdotesChart />
      </section>
      
    </div>
  );
};

export default AnalyticsPage;
