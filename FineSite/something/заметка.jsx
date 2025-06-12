import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, Label
} from 'recharts';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Spin, Alert, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const { RangePicker } = DatePicker;

export const AverageRatingChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs('2000-01-01'),
    dayjs('2026-12-31'),

  ]);

  const processChartData = (apiData) => {
    const groupedData = apiData.reduce((acc, item) => {
      const localDate = format(parseISO(item.date), 'yyyy-MM-dd'); // преобразуем в локальную дату без времени
      if (!acc[localDate]) {
        acc[localDate] = {
          date: localDate,
          totalRating: 0,
          count: 0,
          items: 0,
        };
      }
      acc[localDate].totalRating += item.avgRating * (item.count || 1);
      acc[localDate].count += item.count || 1;
      acc[localDate].items += item.count || 1;
      return acc;
    }, {});

    return Object.values(groupedData)
      .map(item => ({
        ...item,
        dateObj: parseISO(item.date), // используем parseISO для правильного объекта даты
        avgRating: Number((item.totalRating / item.items).toFixed(1)),
      }))
      .sort((a, b) => a.dateObj - b.dateObj)
      .map(item => ({
        ...item,
        date: format(item.dateObj, 'dd MMM yyyy', { locale: ru }),
        displayDate: format(item.dateObj, 'dd MMM', { locale: ru }),
      }));
  };

  const fetchChartData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/analytics/average-rating-by-date', {
        params: {
          start: startDate,
          end: endDate,
        },
      });
      const apiData = response.data;

      if (apiData.success) {
        // Фильтрация по дате на клиенте (startDate и endDate в формате ISO 8601)
        const filteredData = apiData.data.filter(item => {
          const itemDate = item.date; // формат 'YYYY-MM-DD'
          return itemDate >= startDate.slice(0, 10) && itemDate <= endDate.slice(0, 10);
        });

        const formattedData = processChartData(filteredData);
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


  useEffect(() => {
    const [start, end] = dateRange;
    fetchChartData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
  }, []);

  const handleDateChange = (dates) => {
    if (dates) setDateRange(dates);
  };

  const handleApplyFilter = () => {
    const [start, end] = dateRange;
    fetchChartData(
      start.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
      end.endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    );
  };


  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
          <p className="font-semibold mb-1">{data.displayDate}</p>
          <p className="text-[#8884d8]">Рейтинг: {data.avgRating}</p>
          <p className="text-[#82ca9d]">Анекдотов: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  // Вычисляем оптимальный интервал для меток оси X
  const calculateXAxisInterval = () => {
    const dataLength = chartData.length;
    if (dataLength <= 7) return 0; // Показываем все метки
    if (dataLength <= 14) return 1; // Показываем через одну
    return Math.floor(dataLength / 7); // Примерно 7 меток на графике
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
        Средний рейтинг по датам
      </h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 items-start md:items-center">
        <RangePicker
          locale={{ lang: { locale: 'ru_RU' } }}
          format="YYYY-MM-DD"
          value={dateRange}
          onChange={handleDateChange}
        />
        <Button type="primary" onClick={handleApplyFilter}>
          Применить
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin tip="Загрузка данных..." size="large" />
        </div>
      ) : error ? (
        <Alert
          message="Ошибка загрузки"
          description={`Не удалось загрузить данные: ${error}`}
          type="error"
          showIcon
          className="m-4"
        />
      ) : (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#fff', fontSize: 12 }}
                interval={calculateXAxisInterval()}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                yAxisId="left"
                domain={[0, 5]}
                tick={{ fill: '#fff', fontSize: 12 }}
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
      )}
    </div>
  );
};