import React from 'react';
import ReactDOM from 'react-dom/client'; // Убедитесь, что импорт правильный
import  './css/index.css'

import Image from './component/Image';
import Input from './component/Input';



function SampleText() {
  return (<p>Шаблон для вашего текста</p>);
}


function App_() {
  // const funCat = require('./img/fun_cat/fun_cat.jpg');

  return (
    <div className='App'>
      <Input />
      
      <Image/>
      <SampleText/>

      
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App_/>); // Рендерим компонент App
