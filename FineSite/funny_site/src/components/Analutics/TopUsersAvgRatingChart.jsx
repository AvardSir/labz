import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from 'recharts';
import axios from 'axios';
import { Spin, Alert } from 'antd';

export const TopUsersAvgRatingChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get('/api/top-users-avg-rating?topN=10');
        const apiData = response.data;

        if (apiData.success) {
          const formattedData = apiData.data.map(item => ({
            id: item.IdUser,
            name: item.Name,
            avgRating: item.AvgAnecdoteRating !== null && item.AvgAnecdoteRating !== undefined
  ? Number(item.AvgAnecdoteRating.toFixed(2))
  : 0,

            anecdoteCount: item.AnecdoteCount || 0,
          }));

          setChartData(formattedData);
        } else {
          throw new Error(apiData.message || 'Ошибка при получении данных');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
          <p className="font-semibold mb-1">{data.name}</p>
          <p className="text-[#8884d8]">Средний рейтинг: {data.avgRating}</p>
          <p className="text-[#82ca9d]">Количество анекдотов: {data.anecdoteCount}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Загрузка данных..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка загрузки"
        description={`Не удалось загрузить данные: ${error}`}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
        Топ пользователей по средней оценке анекдотов
      </h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#666', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 20]}
              tick={{ fill: '#8884d8', fontSize: 12 }}
              tickCount={6}
            >
              <Label
                value="Средний рейтинг"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: 'middle', fill: '#8884d8' }}
              />
            </YAxis>
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#82ca9d', fontSize: 12 }}
              domain={[0, 'dataMax + 5']}
            >
              <Label
                value="Количество анекдотов"
                angle={90}
                position="insideRight"
                style={{ textAnchor: 'middle', fill: '#82ca9d' }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="right"
              dataKey="anecdoteCount"
              name="Количество анекдотов"
              fill="#82ca9d"
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgRating"
              name="Средний рейтинг"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
