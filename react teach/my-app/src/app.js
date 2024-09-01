import React from 'react';
import Image from './component/Image';
import fun_cat from './img/fun_cat/fun_cat.jpg'
class Input extends React.Component {
  // Метод helloPrint
  helloPrint() {
    return console.log('hello! onClick');
  }

  onMouse() {
    return console.log('hello! onMouse');
  }

  // Переменная par
  par = 'Введите текст';

  // Метод render
  render() {
    return (
      <input 
        placeholder={this.par} 
        onClick={this.helloPrint.bind(this)} 
        onMouseEnter={this.onMouse.bind(this)}
      />
    );
  }
}

function SampleText() {
  return (<p>Шаблон для вашего текста</p>);
}

class NewText extends React.Component {
  render() {
    return (<p>{this.props.title}</p>);
  }
}

function App_() {
  return (
    <div className='App'>
      <Input />
     
      <SampleText />
      {/* <NewText title='lol'/>
      <NewText title='хехе'/> */}
      <Image image={fun_cat}/>
    </div>
  );
}

export default App_;
