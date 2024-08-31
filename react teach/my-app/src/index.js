import React from 'react';
import ReactDOM from 'react-dom/client'; // Убедитесь, что импорт правильный
import App from './app.js';



// Создаем корень с помощью createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); // Рендерим компонент App
