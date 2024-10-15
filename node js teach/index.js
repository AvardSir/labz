// Подключение к базе данных и настройка Express
const express = require('express');
const mysql = require('mysql2');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Создание пула соединений с базой данных
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "mydb",
    password: "1234",
    connectionLimit: 10 // Максимальное количество соединений
});

// Главная страница: отображение списка пользователей и жанров
app.get('/', (req, res) => {
    const queryUsers = `
        SELECT mydb.пользователи.idПользователи, mydb.пользователи.Имя, mydb.жанры.Жанры
        FROM mydb.пользователи
        JOIN mydb.жанры ON mydb.пользователи.\`Любимый жанр\` = mydb.жанры.idЖанры;
    `;

    const queryGenres = `SELECT * FROM mydb.жанры;`; // Запрос для получения жанров

    // Выполняем запрос для получения пользователей
    pool.query(queryUsers, (err, usersResults) => {
        if (err) {
            console.log('Ошибка выполнения запроса:', err);
            return;
        }

        // Выполняем запрос для получения жанров
        pool.query(queryGenres, (err, genresResults) => {
            if (err) {
                console.log('Ошибка выполнения запроса жанров:', err);
                return;
            }

            // Отправляем результаты в шаблон index.ejs
            res.render('index', { users: usersResults, genres: genresResults });
        });
    });
});

// Обработчик для добавления нового пользователя
app.post('/add-user', (req, res) => {
    const { username, favoriteGenre } = req.body; // Извлечение данных из тела запроса

    const insertQuery = `
        INSERT INTO mydb.пользователи (Имя, \`Любимый жанр\`)
        VALUES (?, ?);
    `;

    // Используем пул соединений
    pool.query(insertQuery, [username, favoriteGenre], (err, result) => {
        if (err) {
            console.log('Ошибка добавления пользователя:', err);
            return res.send('Ошибка добавления пользователя');
        }

        console.log('Пользователь добавлен успешно!');
        res.redirect('/'); // Перенаправляем на главную страницу
    });
});


// Обработчик для удаления пользователя
app.post('/delete-user/:id', (req, res) => {
    const userId = req.params.id; // Извлекаем ID пользователя из параметров маршрута

    const deleteQuery = `DELETE FROM mydb.пользователи WHERE idПользователи = ?;`;

    pool.query(deleteQuery, [userId], (err, result) => {
        if (err) {
            console.log('Ошибка удаления пользователя:', err);
            return res.send('Ошибка удаления пользователя');
        }

        console.log('Пользователь удален успешно!');
        res.redirect('/'); // Перенаправляем на главную страницу
    });//not today bruh. today university
});



// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
