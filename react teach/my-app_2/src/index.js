import React from 'react';
import ReactDOM from 'react-dom/client'; // Убедитесь, что импорт правильный
import './css/index.css'

import Input from './component/Input';
import Users from './component/Users';
import Add_user from './component/Add_user';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      bio: "",
      image: "",
      isHappy: false,
    };
  }
render(){
  return (
    <div className='App'>
    <Users />
      <aside>
        <Add_user />
      </aside>
      {/* <Users /> */}
      {/* <Input /> */}
      {/* <Button text='Кнопка не базовая'/> */}
    </div>
  );
}
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); // Рендерим компонент Appexport default Users;

