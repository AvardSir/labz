import React, { useState, useEffect } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Label,
} from 'recharts';
import axios from 'axios';
import { Spin, Alert } from 'antd';

export const AnecdoteRatingDistributionChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/anecdotes');
                const anecdotes = response.data;

                // Группировка оценок по округленным значениям
                const ratingCounts = {};
                anecdotes.forEach(anecdote => {
                    console.log(anecdote)
                    const roundedRating = Math.round(anecdote.Rate); // округляем до ближайшего целого
                    ratingCounts[roundedRating] = (ratingCounts[roundedRating] || 0) + 1;
                });

                // Преобразуем в массив объектов для recharts
                const data = Object.entries(ratingCounts).map(([rating, count]) => ({
                    rating: Number(rating),
                    count,
                })).sort((a, b) => a.rating - b.rating);

                setChartData(data);
            } catch (err) {
                setError(err.message || 'Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
                    <p className="font-semibold mb-1">Оценка: {data.rating}</p>
                    <p className="text-[#82ca9d]">Количество: {data.count}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center">
                Распределение оценок анекдотов
            </h2>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="rating"
                            tick={{ fill: '#666', fontSize: 12 }}
                            label={{ value: 'Оценка', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis
                            tick={{ fill: '#82ca9d', fontSize: 12 }}
                            allowDecimals={false}
                        >
                            <Label
                                value="Количество"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle', fill: '#82ca9d' }}
                            />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="count"
                            name="Количество анекдотов"
                            fill="#82ca9d"
                            barSize={30}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
