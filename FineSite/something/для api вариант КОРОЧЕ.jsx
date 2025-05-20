вот данные для api


const express = require('express');
const sql = require('mssql');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Для обработки JSON-запросов

// Настройки подключения к SQL Server
const dbConfig = {
    server: 'DESKTOP-97TS327\\MSSQLSERVER2', // Укажите правильное имя вашего сервера
    database: 'FunnySite',
    user: 'sa', // Имя пользователя
    password: '1234', // Пароль
    options: {
        encrypt: true, // Если требуется шифрование соединения
        trustServerCertificate: true, // Для локальной разработки
    },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Подключено к базе данных!');
        return pool;
    })
    .catch(err => {
        console.error('Ошибка подключения к БД:', err);
        process.exit(1); // Завершаем процесс при ошибке подключения
    });

app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool
      .request()
      .input('IdEvent', sql.Int, id)
      .query('SELECT title, description FROM Events WHERE IdEvent = @IdEvent');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('SQL error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
