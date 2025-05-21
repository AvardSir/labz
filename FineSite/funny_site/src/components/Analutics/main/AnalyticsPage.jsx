import React, { useState } from 'react';
import { AverageRatingChart } from '../AverageRatingChart';
import { AnecdoteTypeRatingChart } from '../AnecdoteTypeRatingChart';
import { TopUsersAvgRatingChart } from '../TopUsersAvgRatingChart';
import { TopUsersByAnecdotesChart } from '../TopUsersByAnecdotesChart';
import { TopRatedAnecdotesChart } from '../TopRatedAnecdotesChart';
import { AnecdoteRatingDistributionChart } from '../AnecdoteRatingDistributionChart';
import { Header } from '../../Header';

const charts = [
  <AverageRatingChart key="avg" />,
  <AnecdoteTypeRatingChart key="type" />,
  <TopUsersAvgRatingChart key="topAvg" />,
  <TopUsersByAnecdotesChart key="topCount" />,
  <TopRatedAnecdotesChart key="topRated" />,
  <AnecdoteRatingDistributionChart key="distribution" />,
];

const AnalyticsPage = () => {
  const [viewMode, setViewMode] = useState('list');

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Header/>
<h1 
    className="text-3xl font-bold mb-6" 
    style={{ textAlign: 'center' }} // Центрирование текста
>
    Аналитика анекдотов
</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Список
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Плитка
        </button>
      </div>

      {viewMode === 'list' && (
        <div className="list-container space-y-6">
          {charts.map((Component, idx) => (
            <section key={idx} className="p-4 border rounded">
              {Component}
            </section>
          ))}
        </div>
      )}

      {viewMode === 'grid' && (
        <div
          className="grid-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(2, auto)',
            gap: '1rem',
          }}
        >
          {charts.map((Component, idx) => (
            <section key={idx} className="p-4 border rounded">
              {Component}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
