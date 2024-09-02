import React from 'react';
import ReactDOM from 'react-dom/client'; // Убедитесь, что импорт правильный
import  './css/index.css'

import Input from './component/Input';

import Users  from './component/Users';



function App() {
  // const funCat = require('./img/fun_cat/fun_cat.jpg');

  return (
    <div className='App'>
      {/* <Input /> */}
      <Users/>
      {/* <Button text='Кнопка не базовая'/> */}
      
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>); // Рендерим компонент Appexport default Users;

