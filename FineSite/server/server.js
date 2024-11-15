const express = require('express');
const sql = require('mssql');

const app = express();

// Настройки подключения к SQL Server
const dbConfig = {
    server: 'DESKTOP-97TS327\\MSSQLSERVER2', // Убедитесь, что используется правильное имя
    database: 'FunnySite',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    authentication: {
        type: 'default',
    },
};




// Эндпоинт для получения анекдотов
app.get('/api/anecdotes', async (req, res) => {
    try {
        // Подключение к базе данных
        console.log('Подключаемся к базе данных...');
        await sql.connect(dbConfig);
        console.log('Подключение установлено!');
        
        // Выполнение запроса
        const result = await sql.query('EXEC [dbo].[GetAnecdotes]');
        console.log('Результат запроса анекдотов:', result.recordset);

        // Отправка результата
        res.json(result.recordset);
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send(`Ошибка сервера: ${err.message}`);
    }
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
