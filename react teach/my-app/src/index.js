import React from 'react';
import ReactDOM from 'react-dom/client'; // Убедитесь, что импорт правильный



class Input {
  let par = 'priv how a u';
  render(){
    return(<input 
      placeholder = { par } 
      onClick = { helloPrint } 
      onMouseEnter = { onMouse }
      />)
  }


  helloPrint() {
    return console.log('hello! onClick');
  }

  onMouse() {
    return console.log('hello! onMouse');
  }
}
function EmmtyText() {
  return (<p>Привет это текст текст 2+1</p>)
}
class NewText extends React.Component {
  render() {
    return (<p>Проверка классов</p>)

  }
}
function App() {
  return (
    <div className='App'>
      <Input />
      <EmmtyText />
      <EmmtyText />
      <EmmtyText />
      <NewText />

    </div>

  );
}

// Создаем корень с помощью createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); // Рендерим компонент App
