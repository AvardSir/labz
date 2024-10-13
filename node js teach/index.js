// const http=require('http')
// const fs=require('fs')
// let server = http.createServer((req,res)=>{
//     res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})

//     if (req.url === '/') {
//         fs.createReadStream('templates/index.html').pipe(res);
//     } else if (req.url === '/about') {
//         fs.createReadStream('templates/about.html').pipe(res);
//     }
//     else 
//    {
//         fs.createReadStream('templates/error.html').pipe(res);
//     }
    
//     // res.end('Hello <b>ddd<b>')
// })

// const PORT=3000
// const HOST='localhost'

// server.listen(PORT,HOST,()=>{
//     console.log(`Сервер запущен ${PORT} и ${HOST}`)
// }) 

const express=require('express')
const app=express()

const mysql = require('mysql2');

// Настройка соединения с базой данных
const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'mydb',   // Укажи здесь свою базу данных
    password: '1234'
});

// Подключаемся к базе данных
conn.connect(err => {
    if (err) {
        console.log('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Соединение установлено');

    // Выполняем SQL-запрос для получения пользователей и их любимых жанров
    const query = `
        SELECT пользователи.idПользователи, пользователи.Имя, жанры.idЖанры
        FROM пользователи
        JOIN жанры ON пользователи.Любимый жанр = жанры.idЖанры;
    `;

    conn.query(query, (err, results, fields) => {
        if (err) {
            console.log('Ошибка выполнения запроса:', err);
            return;
        }
        
        console.log('Список пользователей и их любимых жанров:');
        console.log(results);

        // Закрываем соединение после выполнения запроса
        conn.end();
    });
});


app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/user/:username',(req,res)=>{
    let data = {username: req.params.username, hoby:['fotbal','socer','swiming']}
    res.render('user',data)
})
 
app.get('/about',(req,res)=>{
    res.render('about')
})

app.post('/check-user',(req,res)=>{
    console.log(req.body)
    if (req.body.username==""){
        res.redirect('/')
    }
    else{
        res.redirect('/user/'+req.body.username)
    }
})

PORT=3000
app.listen(PORT,()=>{
    console.log(`server start localhost:${PORT}`)
})