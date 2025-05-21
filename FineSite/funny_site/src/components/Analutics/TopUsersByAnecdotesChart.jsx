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
import { Select, InputNumber } from 'antd';
const { Option } = Select;
export const TopUsersByAnecdotesChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topN, setTopN] = useState();
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc'

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/top-users-by-anecdotes');
                const apiData = response.data;

                if (apiData.success) {
                    let filteredData = apiData.data
                        .filter(item => item.AnecdoteCount > 0)
                        .map(item => ({
                            id: item.IdUser,
                            name: item.Name,
                            anecdoteCount: item.AnecdoteCount,
                        }));

                    setChartData(filteredData);
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
    useEffect(() => {
        if (chartData.length > 0 && (topN === null || topN === 0)) {
            setTopN(chartData.length);
        }
    }, [chartData, topN]);




    const displayedData = React.useMemo(() => {
        if (!chartData.length) return [];

        // сортируем
        const sorted = [...chartData].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.anecdoteCount - b.anecdoteCount;
            }
            return b.anecdoteCount - a.anecdoteCount;
        });

        // отрезаем topN
        return sorted.slice(0, topN);
    }, [chartData, sortOrder, topN]);



    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
                    <p className="font-semibold mb-1">{data.name}</p>
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
                Топ пользователей по количеству анекдотов
            </h2>
            <div className="flex flex-wrap gap-4 mb-4 items-center">
                <div>
                    <label className="mr-2 font-medium">Сортировка:</label>
                    <Select value={sortOrder} onChange={setSortOrder} style={{ width: 160 }}>
                        <Option value="desc">По убыванию</Option>
                        <Option value="asc">По возрастанию</Option>
                    </Select>
                </div>
                <div>
                    <label className="mr-2 font-medium">Количество элементов:</label>
                    <InputNumber
                        min={1}
                        max={chartData.length}
                        value={topN ||chartData.length}
                        onChange={value => setTopN(value )}
                    />
                </div>
            </div>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={displayedData}
                        margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#666', fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            interval="preserveStartEnd"
                            height={60}
                            minTickGap={20}
                        />
                        <YAxis
                            tick={{ fill: '#82ca9d', fontSize: 12 }}
                            domain={[0, 'dataMax + 5']}
                            tickCount={6}
                        >
                            <Label
                                value="Количество анекдотов"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle', fill: '#82ca9d' }}
                            />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="anecdoteCount"
                            name="Количество анекдотов"
                            fill="#82ca9d"
                            barSize={20}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
