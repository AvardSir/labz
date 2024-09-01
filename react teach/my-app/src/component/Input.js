import React from 'react';
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
export default Input