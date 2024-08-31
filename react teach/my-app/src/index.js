import React from 'react';
import ReactDOM from 'react-dom/client'; // Убедитесь, что импорт правильный
import app_ from './img/app.js';
import  './css/index.css'


// console.log(<EmmtyText></EmmtyText>)
// Создаем корень с помощью createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<app_/>); // Рендерим компонент App
