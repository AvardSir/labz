
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
    const { Text, IdUser, IdAnecdote } = req.body;  // Получаем данные из тела запроса

    // Проверка на наличие всех обязательных параметров
    if (!Text || !IdUser || !IdAnecdote) {
        return res.status(400).json({ error: "Все поля (Text, IdUser, IdAnecdote) обязательны для заполнения." });
    }

    // Создание SQL-запроса через sql.request()
    new sql.Request()
        .input('Text', sql.NVarChar, Text)
        .input('IdUser', sql.Int, IdUser)
        .input('IdAnecdote', sql.Int, IdAnecdote)
        .execute('AddComment') // Вызов хранимой процедуры
        .then((result) => {
            // Проверка на успешное добавление комментария
            if (result.rowsAffected[0] === 0) {
                return res.status(500).json({ error: "Комментарий не был добавлен." });
            }

            res.status(200).json({ message: "Комментарий успешно добавлен", result });
        })
        .catch((err) => {
            console.error("Ошибка при добавлении комментария:", err);
            return res.status(500).json({ error: "Ошибка сервера при добавлении комментария." });
        });
});




  

  // В серверной части, используя Express
  // Запрос для логина (POST /api/login)
app.post('/api/GetUserDetailsByNameAndPassword', async (req, res) => {
  const { login, password } = req.body;
  
  try {
    const result = await sql.query`EXEC [dbo].[GetUserDetailsByNameAndPassword] @Name=${login}, @Password=${password}`;
    
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);  // Если пользователь найден, возвращаем его данные
    } else {
      res.status(401).send('Неверные логин или пароль');
    }
  } catch (err) {
    console.error('Ошибка авторизации:', err);
    res.status(500).send('Ошибка сервера');
  }
});

// Запрос для получения данных пользователя (GET /api/users/:id)
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  
  // Преобразуем id в целое число
  const userId = parseInt(id, 10);
  
  if (isNaN(userId)) {
    return res.status(400).send('Некорректный ID пользователя');
  }

  try {
    const result = await sql.query`EXEC [dbo].[GetUserDetailsById] @IdUser=${userId}`;
    
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]); // Возвращаем данные пользователя по ID
    } else {
      res.status(404).send('Пользователь не найден');
    }
  } catch (err) {
    console.error('Ошибка при получении данных пользователя:', err);
    res.status(500).send('Ошибка сервера');
  }
});




app.get('/api/comments', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig); // Соединяемся с БД
    const result = await pool.request().execute('GetCommentsWithAuthors'); // Выполняем хранимую процедуру

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);  // Возвращаем данные комментариев
    } else {
      res.status(404).send('Комментариев не найдено');
    }
  } catch (err) {
    console.error('Ошибка при получении комментариев:', err);
    res.status(500).send('Ошибка сервера');
  }
});


app.get("/api/IdByUsername", (req, res) => {
  const { Name } = req.query; // Получаем параметр Name из строки запроса

  if (!Name) {
      return res.status(400).json({ error: "Параметр Name обязателен." });
  }
  
  // Вызов хранимой процедуры
  const query = "EXEC GetUserIdByName @Name = @Name";
  const request = new sql.Request();
  request.input("Name", sql.NVarChar, Name);

  request.query(query, (err, result) => {
      if (err) {
          console.error("Ошибка выполнения запроса:", err);
          return res.status(500).json({ error: "Ошибка сервера." });
      }

      if (result.recordset.length === 0) {
          return res.status(404).json({ error: "Пользователь не найден." });
      }

      res.status(200).json(result.recordset[0]); // Возвращаем первый найденный результат
  });
});


app.get("/api/IdByUsername_forEvents", async (req, res) => {
  const { Name } = req.query; // Получаем параметр Name из строки запроса

  if (!Name) {
    return res.status(400).json({ error: "Параметр Name обязателен." });
  }

  try {
    // Подключаемся к пулу соединений
    const pool = await poolPromise;

    // Выполняем запрос с использованием параметра
    const result = await pool
      .request()
      .input("Name", sql.NVarChar, Name)
      .query("EXEC GetUserIdByName @Name");

    // Если пользователь не найден, возвращаем соответствующий статус
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден." });
    }

    // Возвращаем успешный результат
    res.status(200).json(result.recordset[0]); // Возвращаем первый найденный результат
  } catch (err) {
    console.error("Ошибка выполнения запроса:", err);
    res.status(500).json({ error: "Ошибка сервера." });
  }
});



app.get('/api/get-comments-for-event', async (req, res) => {
  // Получение параметра eventId из строки запроса
  const { eventId } = req.query;

  // Проверка на наличие и валидность eventId
  const parsedEventId = Number(eventId); // Преобразование в число
  if (!parsedEventId || isNaN(parsedEventId)) {
      return res.status(400).json({ error: 'Параметр eventId обязателен и должен быть числом.' });
  }

  try {
      const pool = await poolPromise; // Используем глобальный пул соединений

      // Вызов хранимой процедуры
      const result = await pool.request()
          .input('EventId', sql.Int, parsedEventId) // Передаем параметр в запрос
          .execute('GetCommentsForEventByIdEvent'); // Хранимая процедура

      // Проверка на наличие результатов
      if (!result.recordset || result.recordset.length === 0) {
          return res.status(404).json({ message: 'Комментарии для этого события не найдены.' });
      }

      // Возвращаем успешный результат
      res.status(200).json(result.recordset);
  } catch (err) {
      console.error('Ошибка выполнения запроса:', err.message, err.stack);
      res.status(500).json({ error: 'Ошибка сервера.' });
  }
});






app.get('/event-details/:IdEvent', async (req, res) => {
  const { IdEvent } = req.params;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`EXEC GetEventDetailsByIdEvent @EventId = ${IdEvent}`;
    
    // Если нет данных
    if (result.recordset.length === 0) {
      return res.status(404).send('Event not found');
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).send(`Server error: ${err.message}`);
  } finally {
    await sql.close();
  }
});


app.post('/api/add-comment', async (req, res) => {
  const { text, idEvent, idUser } = req.body; // Получаем данные из тела запроса

  // Проверяем наличие всех необходимых параметров
  if (!text || !idEvent || !idUser) {
      return res.status(400).json({ error: 'Параметры text, idEvent и idUser обязательны.' });
  }

  try {
      const pool = await poolPromise; // Используем глобальный пул соединений

      // Вызов хранимой процедуры
      await pool.request()
          .input('Text', sql.NVarChar(sql.MAX), text)
          .input('IdEvent', sql.Int, idEvent)
          .input('IdUser', sql.Int, idUser)
          .execute('AddCommentEvent'); // Имя вашей хранимой процедуры

      // Успешный ответ
      res.status(201).json({ message: 'Комментарий успешно добавлен.' });
  } catch (err) {
      console.error('Ошибка выполнения запроса:', err.message, err.stack);
      res.status(500).json({ error: 'Ошибка сервера.' });
  }
});








app.post("/api/add-entry", async (req, res) => {
  const { IdEvent, IdUser } = req.body;

  if (!IdEvent || !IdUser) {
    return res.status(400).json({ error: "Параметры IdEvent и IdUser обязательны." });
  }

  if (isNaN(IdEvent) || isNaN(IdUser)) {
    return res.status(400).json({ error: "IdEvent и IdUser должны быть числами." });
  }

  try {
    const request = new sql.Request();
    request.input("IdEvent", sql.Int, IdEvent);
    request.input("IdUser", sql.Int, IdUser);

    const result = await request.execute("AddEntryAndDecrementSeats");

    if (result.returnValue !== 0) {
      return res.status(400).json({ error: "Не удалось записаться на мероприятие. Возможно, мест больше нет." });
    }

    res.status(200).json({ message: "Вы успешно записались на мероприятие." });
  } catch (err) {
    console.error("Ошибка выполнения процедуры:", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "Ошибка сервера." });
  }
});



// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
