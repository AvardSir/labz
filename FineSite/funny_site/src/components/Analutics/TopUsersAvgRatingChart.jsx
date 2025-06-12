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
// import { Spin, Alert, InputNumber,  } from 'antd';
import { Spin, Alert, InputNumber, Select, Switch } from 'antd';
const { Option } = Select;


export const TopUsersAvgRatingChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topN, setTopN] = useState();
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' или 'desc'


    const fetchChartData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/top-users-avg-rating?topN=1000`);
            const apiData = response.data;

            if (apiData.success) {
                let formattedData = apiData.data.map(item => ({
                    id: item.IdUser,
                    name: item.Name,
                    avgRating:
                        item.AvgAnecdoteRating !== null && item.AvgAnecdoteRating !== undefined
                            ? Number(item.AvgAnecdoteRating.toFixed(2))
                            : 0,
                    anecdoteCount: item.AnecdoteCount || 0,
                }));

                formattedData.sort((a, b) =>
                    sortOrder === 'asc' ? a.avgRating - b.avgRating : b.avgRating - a.avgRating
                );

                // если topN ещё не установлен — установить в длину данных
                if (topN === null) {
                    setTopN(formattedData.length);
                }

                // отображать слайс отрезка
                if (topN === null) {
                    setTopN(formattedData.length); // Установим максимум, если ещё не задано
                    setChartData(formattedData); // показываем всё
                } else {
                    setChartData(formattedData.slice(0, topN));
                }

            } else {
                throw new Error(apiData.message || 'Ошибка при получении данных');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData();
        // не включаем topN в зависимости, иначе будет перезапуск на первый setTopN
        // только sortOrder влияет на сортировку
    }, [sortOrder]);

    // второй useEffect чтобы реагировать на изменение topN после первой загрузки
    useEffect(() => {
        if (topN !== null) {
            fetchChartData();
        }
    }, [topN]);



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

    return (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                Топ пользователей по средней оценке анекдотов
            </h2>

            <div className="flex items-center gap-3 mb-4">
  <div style={{ marginBottom: '12px' }}>
    <span className="mr-2">Количество пользователей:</span>
    <InputNumber
      min={1}
      max={chartData.length}
      value={topN || chartData.length}
      onChange={value => setTopN(value)}
    />
  </div>
  <div>
    <label className="mr-2 font-medium">Сортировка:</label>
    <Select value={sortOrder} onChange={setSortOrder} style={{ width: 200 }}>
      <Option value="desc">По убыванию рейтинга</Option>
      <Option value="asc">По возрастанию рейтинга</Option>
    </Select>
  </div>
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
                            margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#fff', fontSize: 12 }}
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
            )}
        </div>
    );
};
