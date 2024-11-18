
const express = require('express');
const sql = require('mssql');

const app = express();

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

// Подключение к базе данных
sql.connect(dbConfig).then(() => {
    console.log('Подключено к базе данных!');
}).catch(err => console.error('Ошибка подключения к БД:', err));

// Эндпоинт для получения анекдотов
app.get('/api/anecdotes', async (req, res) => {
    try {
        const result = await sql.query('EXEC [dbo].[GetAnecdotes]');
        res.json(result.recordset);
    } catch (err) {
        console.error('Ошибка получения анекдотов:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Эндпоинт для получения мероприятий
app.get('/api/events', async (req, res) => {
    try {
        const result = await sql.query('EXEC [dbo].[GetEventDetails]');
        res.json(result.recordset);
    } catch (err) {
        console.error('Ошибка получения мероприятий:', err);
        res.status(500).send('Ошибка сервера');
    }
});



app.get('/api/anecdotes/types', async (req, res) => {
  try {
      // Подключаемся к базе данных
      let pool = await sql.connect(dbConfig);
      
      // Выполняем запрос на получение типов анекдотов
      let result = await pool.query(`
          SELECT 
              [IdTypeAnecdote], 
              [TypeAnecdote] 
          FROM 
              [FunnySite].[dbo].[Тип_анекдота]
      `);

      // Преобразуем результат в нужный формат (Id и название типа анекдота)
      const types = result.recordset.map(item => ({
          id: item.IdTypeAnecdote,
          name: item.TypeAnecdote // Исправлено название поля на TypeAnecdote
      }));

      // Отправляем данные клиенту в формате JSON
      res.status(200).json(types);
  } catch (err) {
      // Обрабатываем ошибку, если запрос не удался
      console.error("Ошибка получения типов анекдотов:", err);
      res.status(500).send("Ошибка при получении типов анекдотов");
  }
});

  

  app.get('/api/anecdotes/by-type', async (req, res) => {
    const { idTypeAnecdote } = req.query; // Получаем параметр из запроса

    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool
            .request()
            .input("IdTypeAnecdote", sql.Int, idTypeAnecdote)  // Передаем параметр в запрос
            .execute("[dbo].[GetAnecdotesByType]");  // Выполняем хранимую процедуру

        res.status(200).json(result.recordset);  // Возвращаем результат клиенту
    } catch (err) {
        console.error("Ошибка получения анекдотов по типу:", err);
        res.status(500).send("Ошибка сервера");
    }
});



app.get('/api/events/types', async (req, res) => {
  try {
      let pool = await sql.connect(dbConfig);
      
      // Выполняем запрос на получение типов мероприятий
      let result = await pool.query(`
          SELECT 
              [Id] AS EventTypeId, 
              [EventTypeName] AS EventTypeName
          FROM 
              [FunnySite].[dbo].[EventTypeId]
      `);

      // Преобразуем результат в нужный формат (EventTypeId и название типа мероприятия)
      const eventTypes = result.recordset.map(item => ({
          id: item.EventTypeId,
          name: item.EventTypeName
      }));

      // Отправляем данные клиенту в формате JSON
      res.status(200).json(eventTypes);
  } catch (err) {
      console.error("Ошибка получения типов мероприятий:", err);
      res.status(500).send("Ошибка при получении типов мероприятий");
  }
});

  
  app.get('/api/events/by-type', async (req, res) => {
    const { idTypeEvent } = req.query; // Получаем параметр типа мероприятия из запроса
  
    try {
      // Подключаемся к базе данных
      let pool = await sql.connect(dbConfig);
  
      // Выполняем запрос, передавая параметр для типа мероприятия
      let result = await pool
        .request()
        .input("EventTypeId", sql.Int, idTypeEvent) // Вводим параметр @EventTypeId
        .execute("[dbo].[GetEventDetailsByType]"); // Выполняем хранимую процедуру
  
      // Возвращаем результат в формате JSON
      res.status(200).json(result.recordset);  
    } catch (err) {
      console.error("Ошибка при получении мероприятий по типу:", err);
      res.status(500).send("Ошибка при получении мероприятий");
    }
  });
  
  app.get("/api/events/get-events", async (req, res) => {
    try {
      await sql.connect(config);
      const result = await sql.query`exec [dbo].[GetEvents]`;
      res.json(result.recordset); // Возвращаем результат из SQL запроса
    } catch (err) {
      console.error("Ошибка при выполнении запроса:", err);
      res.status(500).send("Ошибка при выполнении запроса");
    }
  });
  



  app.get('/api/users/rights', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);

        // Выполнение хранимой процедуры
        let result = await pool.request().execute('GetUsersWithRights');

        // Отправка результата в формате JSON
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Ошибка получения пользователей и их прав:", err);
        res.status(500).send("Ошибка при получении пользователей и их прав");
    }
});


// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
