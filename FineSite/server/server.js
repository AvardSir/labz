
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
  



  app.get('/api/users/users', async (req, res) => {
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


app.get('/api/comments-anecdote', async (req, res) => {
  const anecdoteId = req.query.anecdoteId;

  if (!anecdoteId) {
    return res.status(400).json({ error: "Параметр anecdoteId обязателен." });
  }

  try {
    const result = await sql.query(`EXEC [dbo].[GetCommentsForAnecdote] @AnecdoteId = ${anecdoteId}`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка получения комментариев:', err);
    res.status(500).send('Ошибка сервера');
  }
});




  app.put('/api/update-user', async (req, res) => {
    const { IdUser, Name, Password, Email, Bio } = req.body;
  
    try {
      const pool = await sql.connect(dbConfig);
  
      const result = await pool.request()
        .input('IdUser', sql.Int, IdUser)
        .input('Name', sql.NVarChar(255), Name)
        .input('Password', sql.NVarChar(255), Password)
        .input('Email', sql.NVarChar(255), Email)
        .input('Bio', sql.NVarChar(sql.MAX), Bio)
        .execute('UpdateUserInfo'); // Вызываем хранимую процедуру
  
      res.status(200).json({ message: 'Данные успешно обновлены!' });
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  });
  
  

  app.get("/api/check-name", async (req, res) => {
    const { name } = req.query; // Извлекаем имя из параметров запроса
    const userId = req.query.userId; // Извлекаем ID пользователя, если нужно исключить его из проверки
  
    if (!name) {
      return res.status(400).json({ message: "Имя не может быть пустым" });
    }
  
    try {
      // Устанавливаем соединение с базой данных
      await sql.connect(config);
  
      // SQL запрос для проверки уникальности имени
      const result = await sql.query`
        SELECT COUNT(*) AS UserCount
        FROM Users
        WHERE Name = ${name} AND IdUser != ${userId}
      `;
  
      // Проверяем, есть ли другие пользователи с таким же именем
      if (result.recordset[0].UserCount > 0) {
        return res.json({ isUnique: false });
      } else {
        return res.json({ isUnique: true });
      }
    } catch (err) {
      console.error("Ошибка при проверке имени:", err);
      res.status(500).json({ message: "Ошибка сервера при проверке имени" });
    } finally {
      // Закрытие соединения с базой данных
      await sql.close();
    }
  });



  

  //2 версия эпопея коментов
  app.get("/api/comments-anecdote", async (req, res) => {
    const anecdoteId = req.query.anecdoteId;
  
    if (!anecdoteId) {
      return res.status(400).json({ error: "Параметр anecdoteId обязателен." });
    }
  
    try {
      const result = await pool.request()
        .input('AnecdoteId', sql.Int, anecdoteId)  // Передаем параметр в запрос
        .execute('GetCommentsForAnecdote');  // Хранимая процедура
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "Комментарии не найдены." });
      }
  
      res.status(200).json(result.recordset);  // Возвращаем результат
    } catch (err) {
      console.error('Ошибка при получении комментариев:', err);
      res.status(500).send("Ошибка сервера");
    }
  });
  
  

  
  // Добавление комментария к анекдоту
  app.post("/api/add-comment-anecdote", (req, res) => {
    const { Text, IdUser, IdAnecdote } = req.body;
  
    // Проверка на наличие всех обязательных параметров
    if (!Text || !IdUser || !IdAnecdote) {
      return res.status(400).json({ error: "Все поля (Text, IdUser, IdAnecdote) обязательны для заполнения." });
    }
  
    // Вызов хранимой процедуры
    db.query(
      "EXEC AddComment @Text = ?, @IdUser = ?, @IdAnecdote = ?",
      [Text, IdUser, IdAnecdote],
      (err, result) => {
        if (err) {
          console.error("Ошибка при добавлении комментария:", err);
          return res.status(500).json({ error: "Ошибка сервера при добавлении комментария." });
        }
  
        res.status(201).json({ message: "Комментарий успешно добавлен", result });
      }
    );
  });
  

  // В серверной части, используя Express
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const result = await sql.query(`
      SELECT [IdUser], [Name], [Password], [Email], [Bio], [IdRights]
      FROM [FunnySite].[dbo].[Пользователь]
      WHERE [Name] = @login AND [Password] = @password
    `, [login, password]);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.json({ success: true, user });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error('Ошибка авторизации:', err);
    res.status(500).send('Ошибка сервера');
  }
});


// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
