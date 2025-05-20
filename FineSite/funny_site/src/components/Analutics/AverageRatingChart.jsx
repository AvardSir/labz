import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Label
} from 'recharts';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Spin, Alert } from 'antd';

export const AverageRatingChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Тестовые данные, замените на реальный API вызов
        const response = await axios.get('/api/analytics/average-rating-by-date');
        const apiData = response.data;
        
        // Временные тестовые данные
        // const apiData = {
        //   success: true,
        //   data: [
        //     { date: '2025-05-14', avgRating: 4.1, count: 12 },
        //     { date: '2025-05-15', avgRating: 3.8, count: 8 },
        //     { date: '2025-05-16', avgRating: 4.5, count: 15 },
        //     { date: '2025-05-17', avgRating: 3.6, count: 10 },
        //     { date: '2025-05-18', avgRating: 4.0, count: 11 },
        //   ]
        // };

        if (apiData.success) {
          const formattedData = apiData.data.map(item => ({
            ...item,
            date: format(parseISO(item.date), 'dd MMM', { locale: ru }),
            avgRating: Number(item.avgRating.toFixed(1))
          }));
          setChartData(formattedData);
        } else {
          throw new Error(apiData.message || 'Ошибка при получении данных');
        }
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
          <p className="font-semibold mb-1">{payload[0].payload.date}</p>
          <p className="text-[#8884d8]">Рейтинг: {payload[0].payload.avgRating}</p>
          <p className="text-[#82ca9d]">Анекдотов: {payload[0].payload.count}</p>
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
      {/* {console.log(chartData)} */}
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
        Средний рейтинг по по датам
      </h2>
      
      <div style={{ width: '100%', height: 400 }}>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date"
              tick={{ fill: '#666', fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              yAxisId="left"
              domain={[0, 5]}
              tick={{ fill: '#8884d8', fontSize: 12 }}
              tickCount={6}
            >
              <Label 
                value="Рейтинг" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle', fill: '#8884d8' }}
              />
            </YAxis>
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 'dataMax + 5']}
              tick={{ fill: '#82ca9d', fontSize: 12 }}
            >
              <Label 
                value="Количество" 
                angle={90} 
                position="insideRight" 
                style={{ textAnchor: 'middle', fill: '#82ca9d' }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="right"
              dataKey="count" 
              name="Количество"
              fill="#82ca9d"
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="avgRating" 
              name="Рейтинг"
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

