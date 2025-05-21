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
import { Spin, Alert, InputNumber, Select } from 'antd';

// import { Spin, Alert, InputNumber, Select } from 'antd';
// const { Option } = Select;


const { Option } = Select;

export const AnecdoteTypeRatingChart = () => {
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState();
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/anecdote-ratings');
      const apiData = response.data;

      if (apiData.success) {
        const formattedData = apiData.data.map(item => ({
          id: item.IdTypeAnecdote,
          type: item.TypeAnecdote.trim(),
          avgRating: item.AverageRating !== null && item.AverageRating !== undefined
            ? Number(item.AverageRating.toFixed(2))
            : 0,
          count: item.AnecdoteCount || 0,
        }));

        setChartData(formattedData);
        if (topN === null) {
          setTopN(formattedData.length);
        }
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


  useEffect(() => {
    const sorted = [...chartData].sort((a, b) =>
      sortOrder === 'desc' ? b.avgRating - a.avgRating : a.avgRating - b.avgRating
    );
    setFilteredData(sorted.slice(0, topN));
  }, [chartData, topN, sortOrder]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
          <p className="font-semibold mb-1">{data.type}</p>
          <p className="text-[#8884d8]">Средний рейтинг: {data.avgRating}</p>
          <p className="text-[#82ca9d]">Количество анекдотов: {data.count}</p>
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
        Средний рейтинг по типам анекдотов
      </h2>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div style={{ marginBottom: '16px' }}>
          <label className="mr-2 font-medium">Сколько типов отобразить:</label>
          <InputNumber
  min={1}
  max={chartData.length || 1}
  value={topN || chartData.length || 1}
  onChange={value => setTopN(value || 1)}
/>
        </div>
        <label> </label>
        <div>
          <label className="mr-2 font-medium">Сортировка:</label>
          <Select value={sortOrder} onChange={setSortOrder} style={{ width: 160 }}>
            <Option value="desc">По убыванию рейтинга</Option>
            <Option value="asc">По возрастанию рейтинга</Option>
          </Select>
        </div>

      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={filteredData}
            margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="type"
              tick={{ fill: '#666', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 5]}
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
              dataKey="count"
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
