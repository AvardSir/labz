const express = require('express');
const sql = require('mssql');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const forgotPasswordRoutes = require("./component/forgotPasswordRoutes")

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Папка для хранения аудио
const audioDir = path.join(__dirname, 'audio');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}
app.use('/audio', express.static(audioDir));
app.use('/uploads', express.static(uploadsDir));

// Настройки подключения к базе данных
const dbConfig = {
  server: 'DESKTOP-97TS327\\MSSQLSERVER2',
  database: 'FunnySite',
  user: 'sa',
  password: '1234',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Подключение к SQL Server
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Подключено к базе данных!');
    app.locals.pool = pool
    return pool;
  })
  .catch(err => {
    console.error('Ошибка подключения к БД:', err);
    process.exit(1);
  });

// Настройка Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioDir);
  },
  filename: (req, file, cb) => {
    const id = req.query.id;
    if (!id) {
      return cb(new Error('ID анекдота не указан'));
    }
    cb(null, `${id}.mp3`);
  }
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const eventId = req.params.id;
    const eventDir = path.join(uploadsDir, eventId);

    // Создаем папку для мероприятия, если её нет
    if (!fs.existsSync(eventDir)) {
      fs.mkdirSync(eventDir, { recursive: true });
      console.log(`Создана папка для мероприятия: ${eventDir}`);
    }

    cb(null, eventDir); // Сохраняем сразу в папку мероприятия
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${timestamp}_${name}${ext}`);
  },
});


const imageUpload = multer({ 
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Проверяем тип файла
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены!'), false);
    }
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

app.use("/api", forgotPasswordRoutes)


// 📌 ЕДИНЫЙ ЭНДПОИНТ загрузки аудио
app.post('/api/upload-audio', upload.single('audio'), (req, res) => {
  const id = req.query.id;

  if (!req.file) {
    return res.status(400).json({ error: 'Файл не был загружен' });
  }

  res.status(200).json({
    message: `Аудио для анекдота ${id} успешно загружено`,
    filename: req.file.filename,
  });
});


app.post('/api/events/:id/images', imageUpload.single('image'), async (req, res) => {
  const eventId = req.params.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Файл изображения не найден' });
  }

  try {
    console.log(`Изображение загружено для мероприятия ${eventId}: ${file.filename}`);

    res.status(200).json({
      message: 'Изображение добавлено',
      filename: file.filename,
      path: `/uploads/${eventId}/${file.filename}`,
    });
  } catch (err) {
    console.error('Ошибка при добавлении изображения:', err);

    // Удаляем файл в случае ошибки
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.status(500).json({ error: 'Ошибка сервера при сохранении изображения' });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.delete("/api/events/:id/images/:filename", (req, res) => {
  const { id: eventId, filename } = req.params
  const filePath = path.join(uploadsDir, eventId, filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Файл не найден" })
  }

  try {
    fs.unlinkSync(filePath)
    console.log(`Изображение удалено: ${filePath}`)

    // Проверяем, если папка пустая - удаляем её
    const eventDir = path.join(uploadsDir, eventId)
    const remainingFiles = fs.readdirSync(eventDir)
    if (remainingFiles.length === 0) {
      fs.rmdirSync(eventDir)
      console.log(`Пустая папка удалена: ${eventDir}`)
    }

    res.json({ message: "Изображение удалено" })
  } catch (err) {
    console.error("Ошибка при удалении изображения:", err)
    res.status(500).json({ error: "Ошибка при удалении изображения" })
  }
})
// API: Получить список файлов из папки мероприятия
app.get("/api/events/:id/images", (req, res) => {
  const eventId = req.params.id;
  const dir = path.join(__dirname, "uploads", eventId);

  if (!fs.existsSync(dir)) {
    return res.json([]); // Нет папки = нет картинок
  }

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Ошибка чтения папки:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    // Отфильтровать только изображения
    const imageFiles = files.filter(name =>
      /\.(jpg|jpeg|png|gif)$/i.test(name)
    );

    res.json(imageFiles); // ["test.jpg", "photo2.jpg"]
  });
});


app.post('/api/upload-audio', upload.single('audio'), (req, res) => {
  console.log('Uploaded file:', req.file);
  console.log('Request body:', req.body);

  if (!req.file) {
    return res.status(400).json({ error: 'Файл не был загружен' });
  }

  res.status(200).json({
    message: 'Файл успешно загружен',
    filename: req.file.filename
  });
});




// Эндпоинт для получения анекдотов
app.get('/api/anecdotes', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('EXEC [dbo].[GetAnecdotes]');
    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка получения анекдотов:', err);
    res.status(500).send('Ошибка сервера');
  }
});


app.delete("/api/delete_anecdote", async (req, res) => {
  const { idAnecdote } = req.body;

  if (!idAnecdote || isNaN(idAnecdote)) {
    return res.status(400).json({ error: 'Некорректный ID анекдота' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('IdAnecdote', sql.Int, idAnecdote)
      .execute('DeleteAnecdote');

    res.status(200).json({ message: 'Анекдот успешно удален' });
  } catch (error) {
    console.error("Ошибка при удалении анекдота:", error);
    res.status(500).json({ error: 'Произошла ошибка на сервере' });
  }
});


// Добавление комментария к анекдоту
app.post("/api/add-comment-anecdote", async (req, res) => {
  const { Text, IdUser, IdAnecdote } = req.body;

  if (!Text || !IdUser || !IdAnecdote) {
    return res.status(400).json({ error: "Все поля (Text, IdUser, IdAnecdote) обязательны для заполнения." });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Text', sql.NVarChar, Text)
      .input('IdUser', sql.Int, IdUser)
      .input('IdAnecdote', sql.Int, IdAnecdote)
      .execute('AddComment');

    if (result.rowsAffected[0] === 0) {
      return res.status(500).json({ error: "Комментарий не был добавлен." });
    }

    res.status(200).json({ message: "Комментарий успешно добавлен" });
  } catch (err) {
    console.error("Ошибка при добавлении комментария:", err);
    res.status(500).json({ error: "Ошибка сервера при добавлении комментария." });
  }
});




// Эндпоинт для получения мероприятий
app.get('/api/events', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('EXEC [dbo].[GetEventDetails]');
    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка получения мероприятий:', err);
    res.status(500).send('Ошибка сервера');
  }
});




app.get('/api/anecdotes/types', async (req, res) => {
  try {
    // Подключаемся к базе данных
    let pool = await poolPromise;

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
    let pool = await poolPromise;
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
    let pool = await poolPromise;

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
    let pool = await poolPromise;

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
    // await (config);
    const pool = await poolPromise;

    const result = await pool.request().query`exec [dbo].[GetEvents]`;
    res.json(result.recordset); // Возвращаем результат из SQL запроса
  } catch (err) {
    console.error("Ошибка при выполнении запроса:", err);
    res.status(500).send("Ошибка при выполнении запроса");
  }
});



app.post('/api/add-user', async (req, res) => {
  const { Name, Password, Email, Bio, IdRights } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(Password, saltRounds); // Хешируем

    const pool = await poolPromise;

    const result = await pool.request()
      .input('Name', sql.NVarChar(255), Name)
      .input('Password', sql.NVarChar(255), hashedPassword) // Сохраняем хеш
      .input('Email', sql.NVarChar(255), Email)
      .input('Bio', sql.NVarChar(sql.MAX), Bio)
      .input('IdRights', sql.Int, IdRights)
      .execute('AddUser');

    const newUserId = result.recordset[0].NewUserId;

    res.status(200).json({ message: 'Пользователь успешно добавлен!', userId: newUserId });
  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});


app.get('/api/users/users', async (req, res) => {
  try {
    let pool = await poolPromise;

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
  const { anecdoteId } = req.query;

  if (!anecdoteId) {
    return res.status(400).json({ error: "Параметр anecdoteId обязателен." });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('AnecdoteId', sql.Int, anecdoteId)
      .execute('GetCommentsForAnecdote');

    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка получения комментариев:', err);
    res.status(500).send('Ошибка сервера');
  }
});





app.put('/api/update-user', async (req, res) => {
  const { IdUser, Name, Password, Email, Bio } = req.body;
  console.log('Name::: ', Name);
  console.log('Password::: ', Password);
  try {
    // const hashedPassword = await bcrypt.hash(Password, saltRounds);
    let hashedPassword = null;
    if (Password && Password.trim() !== "") {
      hashedPassword = await bcrypt.hash(Password, saltRounds);
    }


    const pool = await poolPromise;

    await pool.request()
      .input('IdUser', sql.Int, IdUser)
      .input('Name', sql.NVarChar(255), Name)

      .input('Password', sql.NVarChar(255), hashedPassword)
      .input('Email', sql.NVarChar(255), Email)
      .input('Bio', sql.NVarChar(sql.MAX), Bio)
      .execute('UpdateUserInfo');

    res.status(200).json({ message: 'Данные успешно обновлены!' });
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});





app.get("/api/check-name", async (req, res) => {
  const { name, userId } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Имя не может быть пустым" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Name', sql.NVarChar, name)
      .input('UserId', sql.Int, userId || 0)
      .query('SELECT COUNT(*) AS UserCount FROM Users WHERE Name = @Name AND IdUser != @UserId');

    res.json({ isUnique: result.recordset[0].UserCount === 0 });
  } catch (err) {
    console.error("Ошибка при проверке имени:", err);
    res.status(500).json({ message: "Ошибка сервера при проверке имени" });
  }
});














// В серверной части, используя Express
// Запрос для логина (POST /api/login)
app.post('/api/GetUserDetailsByNameAndPassword', async (req, res) => {
  const { login, password } = req.body;


  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Name', sql.NVarChar, login)
      .query('SELECT TOP 1 * FROM Пользователь WHERE Name = @Name');

    if (result.recordset.length === 0) {
      return res.status(401).send(' логин или пароль');
    }

    const user = result.recordset[0];

    const passwordMatch = await bcrypt.compare(password, user.Password);

    // console.log('ff')
    if (!passwordMatch) {
      return res.status(401).send('Неверный пароль или логин');
    }

    res.json(user); // Успешный вход
  } catch (err) {
    console.error('Ошибка авторизации:', err);
    res.status(500).send('Ошибка сервера');
  }
});



// Запрос для получения данных пользователя (GET /api/users/:id)
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return res.status(400).send('Некорректный ID пользователя');
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('IdUser', sql.Int, userId)
      .execute('[dbo].[GetUserDetailsById]');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send('Пользователь не найден');
    }
  } catch (err) {
    console.error('Ошибка:', err);
    res.status(500).send('Ошибка сервера');
  }
});




app.get('/api/comments', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .execute('GetCommentsWithAuthors');

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).send('Комментариев не найдено');
    }
  } catch (err) {
    console.error('Ошибка при получении комментариев:', err);
    res.status(500).send('Ошибка сервера');
  }
});



app.get("/api/IdByUsername", async (req, res) => { // Добавлен async
  const { Name } = req.query;

  if (!Name) {
    return res.status(400).json({ error: "Параметр Name обязателен." });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("Name", sql.NVarChar, Name)
      .query("EXEC GetUserIdByName @Name");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден." });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Ошибка:", err);
    res.status(500).json({ error: "Ошибка сервера." });
  }
});

// sss
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
  const { eventId } = req.query;
  const parsedEventId = Number(eventId);

  if (!parsedEventId || isNaN(parsedEventId)) {
    return res.status(400).json({ error: 'Параметр eventId обязателен и должен быть числом.' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('EventId', sql.Int, parsedEventId)
      .execute('GetCommentsForEventByIdEvent');

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ message: 'Комментарии для этого события не найдены.' });
    }

    // Сортируем записи по дате комментария (от старых к новым)
    const sortedComments = result.recordset.sort((a, b) => new Date(a.CommentDate) - new Date(b.CommentDate));

    res.status(200).json(sortedComments);
  } catch (err) {
    console.error('Ошибка выполнения запроса:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера.' });
  }
});







app.get('/event-details/:IdEvent', async (req, res) => {
  const { IdEvent } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('EventId', sql.Int, IdEvent)
      .execute('GetEventDetailsByIdEvent');

    if (result.recordset.length === 0) {
      return res.status(404).send('Event not found');
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send(`Server error: ${err.message}`);
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






// аа.а

app.post("/api/add-entry", async (req, res) => {
  const { IdEvent, IdUser } = req.body;

  if (!IdEvent || !IdUser) {
    return res.status(400).json({ error: "Параметры IdEvent и IdUser обязательны." });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("IdEvent", sql.Int, IdEvent)
      .input("IdUser", sql.Int, IdUser)
      .execute("AddEntryAndDecrementSeats");

    if (result.returnValue !== 0) {
      return res.status(400).json({ error: "Не удалось записаться на мероприятие." });
    }

    res.status(200).json({ message: "Успешно!" });
  } catch (err) {
    console.error("Ошибка:", err);
    res.status(500).json({ error: "Ошибка сервера." });
  }
});



app.post('/api/add-anecdote', async (req, res) => {
  const { Text, Rate, IdUser, IdTypeAnecdote } = req.body;
  console.log(req.body)
  if (!Text || Rate == null || !IdUser || !IdTypeAnecdote) {
    return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Text', sql.NVarChar(sql.MAX), Text)
      .input('Rate', sql.Int, Rate)
      .input('IdUser', sql.Int, IdUser)
      .input('IdTypeAnecdote', sql.Int, IdTypeAnecdote)
      .output('IdAnecdote', sql.Int)
      .execute('AddNewAnecdote');

    const addedId = result.output.IdAnecdote;
    res.status(200).json({ message: 'Анекдот успешно добавлен!', IdAnecdote: addedId });
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});



app.put('/api/update-anecdote', async (req, res) => {
  const { IdAnecdote, NewText, NewRate, NewIdTypeAnecdote } = req.body;

  // Проверка, что все необходимые данные переданы
  if (!IdAnecdote || !NewText || NewRate == null || !NewIdTypeAnecdote) {
    return res.status(400).json({ error: 'Все поля должны быть заполнены' });
  }

  try {
    // Подключение к базе данных
    let pool = await poolPromise;

    // Вызов хранимой процедуры
    await pool
      .request()
      .input('IdAnecdote', sql.Int, IdAnecdote)
      .input('NewText', sql.NVarChar(sql.MAX), NewText)
      .input('NewRate', sql.Int, NewRate)
      .input('NewIdTypeAnecdote', sql.Int, NewIdTypeAnecdote)
      .execute('UpdateAnecdote');

    res.status(200).json({ message: 'Анекдот успешно обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении анекдота:', error);
    res.status(500).json({ error: 'Произошла ошибка на сервере' });
  }
});


app.get('/api/anecdotes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Подключение к базе данных
    let pool = await poolPromise;

    // Вызов хранимой процедуры
    const result = await pool
      .request()
      .input('IdAnecdote', sql.Int, id)
      .execute('GetAnecdoteById');

    const anecdote = result.recordset[0]; // Предполагаем, что возвращается одна запись
    if (!anecdote) {
      return res.status(404).json({ error: 'Анекдот не найден' });
    }

    res.status(200).json(anecdote); // Отправляем данные анекдота
  } catch (error) {
    console.error('Ошибка при получении анекдота:', error);
    res.status(500).json({ error: 'Произошла ошибка на сервере' });
  }
});

app.post('/api/add_events', async (req, res) => {
  const { description, cost, howManyFreeSeats, name, conducted, eventTypeId } = req.body;

  try {
    // Подключение к базе данных
    let pool = await poolPromise;

    // Вызов хранимой процедуры
    await pool
      .request()
      .input('Description', sql.NVarChar, description)
      .input('Стоимость', sql.Decimal(10, 2), cost)
      .input('HowManyFreeSeats', sql.Int, howManyFreeSeats)
      .input('Name', sql.NVarChar, name)
      .input('Проведено', sql.Bit, conducted)
      .input('EventTypeId', sql.Int, eventTypeId)
      .execute('AddEvent');

    res.status(201).json({ message: 'Мероприятие успешно добавлено' });
  } catch (error) {
    console.error('Ошибка при добавлении мероприятия:', error);
    res.status(500).json({ error: 'Произошла ошибка на сервере' });
  }
});

app.put('/api/update_event', async (req, res) => {
  const { idEvent, description, cost, howManyFreeSeats, name, conducted, eventTypeId } = req.body;

  const conductedBool = conducted === true || conducted === 'true';

  if (
    !idEvent ||
    !description ||
    isNaN(cost) ||
    isNaN(howManyFreeSeats) ||
    !name ||
    !['true', 'false', true, false].includes(conducted) ||
    isNaN(eventTypeId)
  ) {
    return res.status(400).json({ error: "Некорректные входные данные" });
  }


  try {
    let pool = await poolPromise;
    console.log("Параметры запроса:", { idEvent, description, cost, howManyFreeSeats, name, conducted, eventTypeId });

    await pool
      .request()
      .input('IdEvent', sql.Int, idEvent)
      .input('Description', sql.NVarChar, description)
      .input('Cost', sql.Decimal(10, 2), cost)
      .input('HowManyFreeSeats', sql.Int, howManyFreeSeats)
      .input('Name', sql.NVarChar, name)
      .input('Conducted', sql.Bit, conducted ? 1 : 0)  // Преобразуем conducted в 1 (true) или 0 (false)
      .input('EventTypeId', sql.Int, eventTypeId)
      .execute('UpdateEvent');

    res.sendStatus(200); // Просто статус 200 OK, без тела



  } catch (error) {
    console.error("Ошибка при обновлении мероприятия:", error.message, error.stack);
    res.status(500).json({ error: 'Произошла ошибка на сервере' });
  }
});


app.get('/api/event-types', async (req, res) => {
  try {
    // Подключаемся к базе данных
    const pool = await poolPromise;

    // Выполняем запрос для получения всех типов мероприятий
    const result = await pool.request().query('SELECT Id, EventTypeName FROM EventTypeId');

    // Отправляем результат на клиент
    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка при загрузке типов мероприятий:', err.message);
    res.status(500).json({ error: 'Ошибка при загрузке типов мероприятий' });
  }
});

app.delete('/api/delete_event/:idEvent', async (req, res) => {
  const idEvent = parseInt(req.params.idEvent, 10);

  // Проверка ID
  if (!idEvent || isNaN(idEvent)) {
    return res.status(400).json({ error: 'Некорректный ID мероприятия' });
  }

  try {
    const pool = await poolPromise;

    // Проверка существования мероприятия
    const checkResult = await pool
      .request()
      .input('IdEvent', sql.Int, idEvent)
      .query('SELECT 1 FROM [dbo].[Мероприятие] WHERE [IdEvent] = @IdEvent');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    // Удаление мероприятия через процедуру
    await pool
      .request()
      .input('IdEvent', sql.Int, idEvent)
      .execute('DeleteEventById');

    res.status(200).json({ message: 'Мероприятие успешно удалено' });
  } catch (error) {
    console.error('Ошибка при удалении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка сервера при удалении мероприятия' });
  }
});

// все привет чекаем комиты

app.post('/api/anecdotes/rate', async (req, res) => {
  const { IsPlus, IdUser, IdAnecdote } = req.body;

  if (typeof IsPlus !== 'boolean' || !IdUser || !IdAnecdote) {
    return res.status(400).json({
      success: false,
      message: 'Необходимо указать IsPlus (boolean), IdUser (number) и IdAnecdote (number)'
    });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('IsPlus', sql.Bit, IsPlus)
      .input('IdUser', sql.Int, IdUser)
      .input('IdAnecdote', sql.Int, IdAnecdote)
      .execute('sp_AnikGrade_Add');

    const procedureResult = result.recordset[0];

    if (procedureResult.Result.startsWith('Error:')) {
      return res.status(500).json({
        success: false,
        message: procedureResult.Result.replace('Error: ', ''),
        action: procedureResult.ActionTaken
      });
    }

    // Получаем обновленный рейтинг
    const ratingResult = await pool.request()
      .input('IdAnecdote', sql.Int, IdAnecdote)
      .query('SELECT Rate FROM [Анекдот] WHERE IdAnecdote = @IdAnecdote');

    if (!ratingResult.recordset.length) {
      throw new Error('Анекдот не найден');
    }

    res.json({
      success: true,
      message: procedureResult.Result,
      action: procedureResult.ActionTaken,
      newRating: ratingResult.recordset[0].Rate
    });

  } catch (error) {
    console.error('Ошибка при обработке оценки:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обработке оценки',
      error: error.message,
      action: 0
    });
  }
});

app.get('/api/rating', async (req, res) => {
  const { IdUser, IdAnecdote } = req.query;

  if (!IdUser || !IdAnecdote) {
    return res.status(400).send('IdUser и IdAnecdote обязательны');
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('IdUser', sql.Int, IdUser)
      .input('IdAnecdote', sql.Int, IdAnecdote)
      .execute('GetUserRatingForAnecdote');

    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка получения рейтинга:', err);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/api/rated-anecdotes', async (req, res) => {
  const { IdUser } = req.query;

  if (!IdUser) {
    return res.status(400).send('IdUser обязателен');
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('IdUser', sql.Int, IdUser)
      .execute('GetRatedAnecdotesByUser');

    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка получения оценённых анекдотов:', err);
    res.status(500).send('Ошибка сервера');
  }
});


app.get('/api/analytics/average-rating-by-date', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute('GetAverageRatingByDateForAnecdotes');

    const formatted = result.recordset.map(row => ({
      date: row.date, // 'YYYY-MM-DD'
      avgRating: parseFloat(row.avg_rating), // float
      count: row.count // int
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Stored procedure error:', error);
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
});


app.get('/api/anecdote-ratings', async (req, res) => {
  try {
    const pool = await poolPromise; // Ждём подключение пула
    const request = pool.request();
    const result = await request.execute('GetAnecdoteRatingWithType');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера',
    });
  }
});

app.get('/api/top-users-avg-rating', async (req, res) => {
  const topN = parseInt(req.query.topN) || 10; // Можно передать ?topN=число, по умолчанию 10

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('TopN', sql.Int, topN)
      .execute('GetTopUsersByAvgAnecdoteRating');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    console.error('Error executing procedure:', err);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при выполнении процедуры',
      error: err.message,
    });
  }
});


app.get('/top-users-by-anecdotes', async (req, res) => {
  const topN = parseInt(req.query.top) || 10;

  try {
    // const pool = await (/* твои настройки подключения */);
    const pool = await poolPromise;
    const result = await pool.request()
      .input('TopN', sql.Int, topN)
      .execute('GetTopUsersByAnecdoteCount');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);  // <-- добавь это
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера',
    });
  }
});

app.get('/top-rated-anecdotes', async (req, res) => {
  const topN = parseInt(req.query.top) || 10;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('TopN', sql.Int, topN)
      .execute('GetTopRatedAnecdotes');

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера',
    });
  }
});


// server/index.js или где у тебя app и pool
app.get('/api/anecdote-audio-paths', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT IdAnecdote, AudioPath
      FROM [FunnySite].[dbo].[Анекдот]
      WHERE AudioPath IS NOT NULL
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка при получении путей к аудио:', err);
    res.status(500).send('Ошибка сервера');
  }
});



// Создать начало цепочки
app.post('/api/chain/start', async (req, res) => {
  const { Text, AuthorId } = req.body;
  try {
    const pool = await sql.connect(dbConfig);

    // Получаем новый ChainId — это можно сделать просто так,
    // например, max ChainId в AnecdoteChainParts + 1
    const result = await pool.request().query(`
      SELECT ISNULL(MAX(ChainId), 0) + 1 AS NewChainId FROM AnecdoteChainParts
    `);
    const newId = result.recordset[0].NewChainId;

    // Создаём первую часть цепочки (она и создаёт цепочку)
    await pool.request()
      .input('ChainId', sql.Int, newId)
      .input('ParentId', sql.Int, null)
      .input('Text', sql.NVarChar, Text)
      .input('AuthorId', sql.Int, AuthorId)
      .query(`
        INSERT INTO AnecdoteChainParts (ChainId, ParentId, Text, DateCreated, AuthorId, IsClosed)
        VALUES (@ChainId, @ParentId, @Text, GETDATE(), @AuthorId, 0)
      `);

    res.json({ ChainId: newId });
  } catch (err) {
    console.error('Ошибка создания цепочки:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});






app.get('/api/chain/list', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT DISTINCT c.ChainId, p.Text AS StartText
      FROM AnecdoteChainParts p
      JOIN (
          SELECT ChainId, MIN(IdPart) AS FirstPartId
          FROM AnecdoteChainParts
          WHERE ParentId IS NULL
          GROUP BY ChainId
      ) c ON p.IdPart = c.FirstPartId
      ORDER BY c.ChainId
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка получения списка цепочек:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
// Получить всю цепочку по ChainId
app.get('/api/chain/:id', async (req, res) => {
  try {
    let pool = await poolPromise;
    const id = parseInt(req.params.id);

    const result = await pool.request()
      .input('ChainId', sql.Int, id)
      .query(`SELECT IdPart, ParentId, Text FROM AnecdoteChainParts WHERE ChainId = @ChainId ORDER BY DateCreated`);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});






app.get('/api/chain/:chainId/parts', async (req, res) => {
  const { chainId } = req.params;
  try {
    let pool = await poolPromise;
    const result = await pool.request()
      .input('chainId', sql.Int, chainId)
      .query(`
        SELECT IdPart, ChainId, ParentId, Text, DateCreated
        FROM [FunnySite].[dbo].[AnecdoteChainParts]
        WHERE ChainId = @chainId
        ORDER BY IdPart
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.post('/api/chain/continue', async (req, res) => {
  const { ChainId, ParentId, Text } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ChainId', sql.Int, ChainId)
      .input('ParentId', sql.Int, ParentId || null)
      .input('Text', sql.NVarChar(sql.MAX), Text)
      .query(`
        INSERT INTO AnecdoteChainParts (ChainId, ParentId, Text, DateCreated)
        VALUES (@ChainId, @ParentId, @Text, GETDATE())
      `);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.get('/api/test/all-parts', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT TOP 10 * FROM AnecdoteChainParts');
    res.json(result.recordset);
  } catch (error) {
    console.error('Ошибка тестового запроса:', error);
    res.status(500).json({ message: 'Ошибка тестового запроса' });
  }
});


app.post('/api/chain/:id/close', async (req, res) => {
  try {
    const chainId = parseInt(req.params.id);
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input('ChainId', sql.Int, chainId)
      .query(`UPDATE AnecdoteChainParts
SET IsClosed = 1
WHERE ChainId = @ChainId
`);

    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка закрытия цепочки:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


app.get('/api/chain/:id/status', async (req, res) => {
  try {
    const chainId = parseInt(req.params.id);
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('ChainId', sql.Int, chainId)
      .query(`SELECT TOP 1 IsClosed
FROM AnecdoteChainParts
WHERE ChainId = @ChainId
ORDER BY DateCreated DESC
`);

    const isClosed = result.recordset[0]?.IsClosed === true || result.recordset[0]?.IsClosed === 1;
    res.json({ isClosed });
  } catch (err) {
    console.error('Ошибка получения статуса цепочки:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/guess-random', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT TOP 1 *
      FROM AnecdoteGuess
      ORDER BY NEWID()
    `);

    if (!result.recordset[0]) {
      return res.status(404).send('Нет анекдотов для угадывания');
    }

    const row = result.recordset[0];
    const options = [
      { text: row.RealEnding, isCorrect: true },
      { text: row.Fake1, isCorrect: false },
      { text: row.Fake2, isCorrect: false },
    ].sort(() => Math.random() - 0.5);

    res.json({
      id: row.Id, // 👈 добавь это
      beginning: row.Beginning,
      options,
      correct: row.RealEnding,
    });

  } catch (err) {
    console.error('Ошибка в /api/guess-random:', err);
    res.status(500).send('Ошибка сервера');
  }
});


app.post('/api/favorites/add', async (req, res) => {
  const { userId, anecdoteId } = req.body;

  try {
    let pool = await sql.connect(dbConfig);

    const check = await pool.request()
      .input('userId', sql.Int, userId)
      .input('anecdoteId', sql.Int, anecdoteId)
      .query(`
    SELECT 1 FROM [dbo].[FavoriteAnecdotes] 
    WHERE UserId = @userId AND AnecdoteId = @anecdoteId
  `);

    await pool.request()
      .input('userId', sql.Int, userId)
      .input('anecdoteId', sql.Int, anecdoteId)
      .query(`
    INSERT INTO [dbo].[FavoriteAnecdotes] (UserId, AnecdoteId)
    VALUES (@userId, @anecdoteId)
  `);


    res.status(200).json({ message: 'Добавлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
app.get('/api/favorites/check', async (req, res) => {
  const userId = Number(req.query.userId);
  const anecdoteId = Number(req.query.anecdoteId);

  if (isNaN(userId) || isNaN(anecdoteId)) {
    return res.status(400).json({ error: 'Invalid userId or anecdoteId' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('UserId', sql.Int, userId)        // Обратите внимание на UserId
      .input('AnecdoteId', sql.Int, anecdoteId)
      .query('SELECT 1 FROM FavoriteAnecdotes WHERE UserId = @UserId AND AnecdoteId = @AnecdoteId');

    res.json({ exists: result.recordset.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/api/favorites/:idUser', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    const idUser = req.params.idUser;

    const result = await pool.request()
      .input('idUser', sql.Int, idUser)
      .query(`
        SELECT 
          a.IdAnecdote, a.Text, a.Date, a.Rate, a.IdUser, 
          u.Name AS UserName, a.IdTypeAnecdote, t.TypeAnecdote
        FROM FavoriteAnecdotes f
        JOIN [Анекдот] a ON f.AnecdoteId = a.IdAnecdote
        JOIN [Пользователь] u ON a.IdUser = u.IdUser
        JOIN [Тип_анекдота] t ON a.IdTypeAnecdote = t.IdTypeAnecdote
        WHERE f.UserId = @idUser
        ORDER BY a.Date DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.delete('/api/chain/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Некорректный ID цепочки' });
  }

  try {
    let pool = await poolPromise;

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const request = new sql.Request(transaction);

      // Удаляем части цепочки по ChainId
      await request
        .input('ChainId', sql.Int, id)
        .query('DELETE FROM [FunnySite].[dbo].[AnecdoteChainParts] WHERE ChainId = @ChainId');

      await transaction.commit();

      res.json({ message: 'Части цепочки удалены' });
    } catch (err) {
      await transaction.rollback();
      console.error('Ошибка в транзакции удаления:', err);
      res.status(500).json({ message: 'Ошибка при удалении частей цепочки' });
    }
  } catch (e) {
    console.error('Ошибка подключения к БД:', e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/chain/:id/open', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Некорректный ID цепочки' });

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('ChainId', sql.Int, id)
      .query('UPDATE dbo.AnecdoteChainParts SET IsClosed = 0 WHERE ChainId = @ChainId');
    res.json({ message: 'Цепочка открыта' });
  } catch (e) {
    console.error('Ошибка открытия цепочки:', e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});




app.post('/api/guess-add', async (req, res) => {
  const { Beginning, RealEnding, Fake1, Fake2, AuthorId } = req.body;

  if (!Beginning || !RealEnding || !Fake1 || !Fake2 || !AuthorId) {
    return res.status(400).json({
      success: false,
      message: 'Все поля обязательны: Beginning, RealEnding, Fake1, Fake2, AuthorId',
    });
  }

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('Beginning', sql.NVarChar, Beginning)
      .input('RealEnding', sql.NVarChar, RealEnding)
      .input('Fake1', sql.NVarChar, Fake1)
      .input('Fake2', sql.NVarChar, Fake2)
      .input('AuthorId', sql.Int, AuthorId)
      .query(`
        INSERT INTO AnecdoteGuess (Beginning, RealEnding, Fake1, Fake2, AuthorId)
        VALUES (@Beginning, @RealEnding, @Fake1, @Fake2, @AuthorId)
      `);

    res.json({ success: true, message: 'Анекдот успешно добавлен' });
  } catch (err) {
    console.error('Ошибка при добавлении анекдота:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

app.delete('/api/guess-delete/:id', async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return res.status(400).json({ success: false, message: 'Некорректный ID' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('Id', sql.Int, numericId)
      .query('DELETE FROM AnecdoteGuess WHERE Id = @Id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Анекдот не найден' });
    }

    res.json({ success: true, message: 'Анекдот удалён' });
  } catch (err) {
    console.error('Ошибка при удалении анекдота:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

app.delete('/api/favorites/:userId/:anecdoteId', async (req, res) => {
  const { userId, anecdoteId } = req.params;

  try {
    let pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('UserId', sql.Int, userId)
      .input('AnecdoteId', sql.Int, anecdoteId)
      .query(`
        DELETE FROM [FavoriteAnecdotes]
        WHERE [UserId] = @UserId AND [AnecdoteId] = @AnecdoteId
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    res.json({ message: 'Удалено из избранного' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});



app.delete('/api/comment-delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('IdCommentsontheAnecdote', sql.Int, id)
      .query('DELETE FROM [FunnySite].[dbo].[Комментарий_анекдота] WHERE IdCommentsontheAnecdote = @IdCommentsontheAnecdote');
    res.status(200).send({ message: 'Комментарий удалён' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Ошибка удаления комментария' });
  }
});
app.delete('/api/event-comment-delete/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10); // преобразуем в число

  if (isNaN(id)) {
    return res.status(400).json({ error: "Неверный id комментария" });
  }

  try {
    let pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('IdCommentsEvents', sql.Int, id)  // теперь id — число
      .query('DELETE FROM [FunnySite].[dbo].[Коментарий_Мероприятия] WHERE IdCommentsEvents = @IdCommentsEvents');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Комментарий не найден" });
    }

    res.status(200).json({ message: "Комментарий мероприятия удалён" });
  } catch (error) {
    console.error("Ошибка при удалении комментария мероприятия:", error);
    res.status(500).json({ error: "Ошибка сервера при удалении комментария" });
  }
});



app.post("/api/suggest-anecdote", async (req, res) => {
  try {
    const { Text, IdTypeAnecdote, IdUser, Comment, Status = "pending" } = req.body

    // Валидация данных
    if (!Text || !IdTypeAnecdote || !IdUser) {
      return res.status(400).json({
        error: "Обязательные поля: Text, IdTypeAnecdote, IdUser",
      })
    }

    const pool = await req.app.locals.pool // Используем существующий пул подключений

    // Вставляем предложенный анекдот в таблицу SuggestedAnecdotes
    const result = await pool
      .request()
      .input("Text", sql.NVarChar, Text)
      .input("IdTypeAnecdote", sql.Int, IdTypeAnecdote)
      .input("IdUser", sql.Int, IdUser)
      .input("Comment", sql.NVarChar, Comment || null)
      .input("Status", sql.NVarChar, Status)
      .query(`
        INSERT INTO [dbo].[SuggestedAnecdotes] 
        ([Text], [IdTypeAnecdote], [IdUser], [Comment], [Status], [DateSuggested])
        VALUES (@Text, @IdTypeAnecdote, @IdUser, @Comment, @Status, GETDATE());
        
        SELECT SCOPE_IDENTITY() as IdSuggestedAnecdote;
      `)

    const suggestedAnecdoteId = result.recordset[0].IdSuggestedAnecdote

    console.log(`Предложен новый анекдот ID: ${suggestedAnecdoteId} от пользователя ID: ${IdUser}`)

    res.status(201).json({
      message: "Анекдот успешно предложен!",
      IdSuggestedAnecdote: suggestedAnecdoteId,
    })
  } catch (error) {
    console.error("Ошибка при предложении анекдота:", error)
    res.status(500).json({
      error: "Ошибка сервера при предложении анекдота",
    })
  }
})

// API endpoint для получения предложенных анекдотов (для админов)

app.get("/api/suggested-anecdotes", async (req, res) => {
  try {
    const { status = "pending" } = req.query
    const pool = await req.app.locals.pool

    const result = await pool
      .request()
      .input("status", sql.NVarChar, status)
      .query(`
        SELECT 
          sa.[IdSuggestedAnecdote],
          sa.[Text],
          sa.[Comment],
          sa.[Status],
          sa.[DateSuggested],
          sa.[DateReviewed],
          sa.[ReviewComment],
          u.[Name] as UserName,
          tat.[TypeAnecdote] as AnecdoteType
        FROM [dbo].[SuggestedAnecdotes] sa
        JOIN [dbo].[Пользователь] u ON sa.[IdUser] = u.[IdUser]
        JOIN [dbo].[Тип_анекдота] tat ON sa.[IdTypeAnecdote] = tat.[IdTypeAnecdote]
        WHERE sa.[Status] = @status
        ORDER BY sa.[DateSuggested] DESC
      `)

    res.json(result.recordset)
  } catch (error) {
    console.error("Ошибка при получении предложенных анекдотов:", error)
    res.status(500).json({
      error: "Ошибка сервера при получении предложенных анекдотов",
    })
  }
})


// API endpoint для одобрения/отклонения предложенного анекдота (для админов)
app.post("/api/review-suggested-anecdote", async (req, res) => {
  try {
    const { IdSuggestedAnecdote, action, reviewComment, reviewerId } = req.body

    if (!IdSuggestedAnecdote || !action || !reviewerId) {
      return res.status(400).json({
        error: "Обязательные поля: IdSuggestedAnecdote, action, reviewerId",
      })
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        error: "action должен быть 'approve' или 'reject'",
      })
    }

    const pool = await req.app.locals.pool

    if (action === "approve") {
      // Получаем данные предложенного анекдота
      const suggestedResult = await pool
        .request()
        .input("IdSuggestedAnecdote", sql.Int, IdSuggestedAnecdote)
        .query(`
          SELECT [Text], [IdTypeAnecdote], [IdUser]
          FROM [dbo].[SuggestedAnecdotes]
          WHERE [IdSuggestedAnecdote] = @IdSuggestedAnecdote AND [Status] = 'pending'
        `)

      if (suggestedResult.recordset.length === 0) {
        return res.status(404).json({
          error: "Предложенный анекдот не найден или уже обработан",
        })
      }

      const { Text, IdTypeAnecdote, IdUser } = suggestedResult.recordset[0]

      // Добавляем анекдот в основную таблицу
      const addResult = await pool
        .request()
        .input("Text", sql.NVarChar, Text)
        .input("Rate", sql.Int, 1) // Начальный рейтинг
        .input("IdTypeAnecdote", sql.Int, IdTypeAnecdote)
        .input("IdUser", sql.Int, IdUser)
        .query(`
          INSERT INTO [dbo].[Анекдот] ([Text], [Rate], [Date], [IdTypeAnecdote], [IdUser])
          VALUES (@Text, @Rate, GETDATE(), @IdTypeAnecdote, @IdUser);
          
          SELECT SCOPE_IDENTITY() as IdAnecdote;
        `)

      const newAnecdoteId = addResult.recordset[0].IdAnecdote

      // Обновляем статус предложенного анекдота
      await pool
        .request()
        .input("IdSuggestedAnecdote", sql.Int, IdSuggestedAnecdote)
        .input("reviewComment", sql.NVarChar, reviewComment || null)
        .input("reviewerId", sql.Int, reviewerId)
        .input("newAnecdoteId", sql.Int, newAnecdoteId)
        .query(`
          UPDATE [dbo].[SuggestedAnecdotes]
          SET [Status] = 'approved',
              [DateReviewed] = GETDATE(),
              [ReviewComment] = @reviewComment,
              [ReviewerId] = @reviewerId,
              [ApprovedAnecdoteId] = @newAnecdoteId
          WHERE [IdSuggestedAnecdote] = @IdSuggestedAnecdote
        `)

      res.json({
        message: "Анекдот одобрен и добавлен на сайт!",
        IdAnecdote: newAnecdoteId,
      })
    } else {
      // reject
      await pool
        .request()
        .input("IdSuggestedAnecdote", sql.Int, IdSuggestedAnecdote)
        .input("reviewComment", sql.NVarChar, reviewComment || null)
        .input("reviewerId", sql.Int, reviewerId)
        .query(`
          UPDATE [dbo].[SuggestedAnecdotes]
          SET [Status] = 'rejected',
              [DateReviewed] = GETDATE(),
              [ReviewComment] = @reviewComment,
              [ReviewerId] = @reviewerId
          WHERE [IdSuggestedAnecdote] = @IdSuggestedAnecdote AND [Status] = 'pending'
        `)

      res.json({
        message: "Анекдот отклонен",
      })
    }
  } catch (error) {
    console.error("Ошибка при рассмотрении предложенного анекдота:", error)
    res.status(500).json({
      error: "Ошибка сервера при рассмотрении предложенного анекдота",
    })
  }
})



app.get('/api/events/find', async (req, res) => {
  try {
    const { name, description, cost } = req.query;
    
    // Подключение к базе данных
    const pool = await sql.connect(dbConfig);
    
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('cost', sql.Decimal(10, 2), parseFloat(cost))
      .query(`
        SELECT TOP 1 [IdEvent] 
        FROM [FunnySite].[dbo].[Мероприятие]
        WHERE [Name] = @name
          AND [Description] = @description
          AND [Стоимость] = @cost
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Мероприятие не найдено" });
    }
    
    res.json({ id: result.recordset[0].IdEvent });
  } catch (err) {
    console.error('Ошибка поиска мероприятия:', err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  } finally {
    sql.close(); // Закрываем соединение
  }
});



// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});



