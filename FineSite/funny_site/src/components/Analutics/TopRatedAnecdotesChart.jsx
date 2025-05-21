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
import { Spin, Alert, Select, InputNumber } from 'antd';
import { message } from 'antd'; // для всплывающего уведомления

const { Option } = Select;

export const TopRatedAnecdotesChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topN, setTopN] = useState(10);
    const [sortOrder, setSortOrder] = useState('desc'); // asc / desc
    const handleBarClick = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            const fullText = data.activePayload[0].payload.fullText;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(fullText)
                    .then(() => {
                        message.success('Текст анекдота скопирован в буфер обмена');
                    })
                    .catch(() => {
                        message.error('Ошибка копирования текста');
                    });
            } else {
                // fallback для старых браузеров
                alert('Ваш браузер не поддерживает копирование в буфер обмена');
            }
        }
    };

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/top-rated-anecdotes');
                const apiData = response.data;

                if (apiData.success) {
                    const dataFiltered = apiData.data.map(item => {
                        const words = item.Text.split(' ');
                        const shortText = words.length > 2 ? words.slice(0, 2).join(' ') + '...' : item.Text;
                        return {
                            id: item.IdAnecdote,
                            text: shortText,
                            fullText: item.Text,
                            rating: Number(item.Rate.toFixed(2)),
                            userName: item.Name || '—',
                        };
                    });


                    setChartData(dataFiltered);
                    setTopN(Math.min(10, dataFiltered.length));
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

    const displayedData = React.useMemo(() => {
        if (!chartData.length) return [];

        const sorted = [...chartData].sort((a, b) => {
            return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
        });

        return sorted.slice(0, topN);
    }, [chartData, sortOrder, topN]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm max-w-xs whitespace-normal break-words">
                    <p className="font-semibold mb-1">{data.fullText}</p>
                    <p className="text-[#82ca9d]">Оценка: {data.rating}</p>
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
                Топ анекдотов по рейтингу
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
                        value={topN}
                        onChange={value => setTopN(value)}
                    />
                </div>
            </div>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart
  data={displayedData}
  margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
  onClick={handleBarClick}
>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="text"
                            tick={{ fill: '#666', fontSize: 12 }}
                            angle={0} // убрать наклон (или вообще не указывать)
                            textAnchor="middle" // центрировать текст
                            interval={0} // показывать все метки
                            height={60}
                            tickFormatter={str => {
                                const words = str.split(' ');
                                return words.length > 2 ? words.slice(0, 2).join(' ') + '...' : str;
                            }}
                        />
                        <YAxis
                            tick={{ fill: '#8884d8', fontSize: 12 }}
                            domain={[0, 5]}
                            tickCount={6}
                        >
                            <Label
                                value="Рейтинг"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle', fill: '#8884d8' }}
                            />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="rating"
                            name="Рейтинг"
                            fill="#8884d8"
                            barSize={20}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
