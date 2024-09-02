import React from 'react';
import ReactDOM from 'react-dom/client'; // Убедитесь, что импорт правильный
import  './css/index.css'

import Image from './component/Image';
import Input from './component/Input';
import Button from './component/Button';



// function SampleText() {
//   return (<p>Шаблон для вашего текста</p>);
// }


function App() {
  // const funCat = require('./img/fun_cat/fun_cat.jpg');

  return (
    <div className='App'>
      <Input />
      
      <Image/>
      {/* <SampleText/> */}
      <Button />
      <Button text='Кнопка не базовая'/>
      
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>); // Рендерим компонент App
