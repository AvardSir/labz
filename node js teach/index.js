const http = require('http');
const fs = require('fs');

let server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });

    if (req.url === '/') {
        const stream = fs.createReadStream('templates/index.html');
        stream.pipe(res);
        stream.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' });
            res.end('Ошибка при чтении файла index.html');
        });
    } else if (req.url === '/about') {
        const stream = fs.createReadStream('templates/about.html');
        stream.pipe(res);
        stream.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' });
            res.end('Ошибка при чтении файла about.html');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end('404 Страница не найдена');
    }
});

const PORT = 3000;
const HOST = 'localhost';

server.listen(PORT, HOST, () => {
    console.log(`Сервер запущен на ${HOST}:${PORT}`);
});
