import React from 'react';
class Input extends React.Component {



  render() {
    return (
      <input
        placeholder='текст'
        onClick={() => {
          console.log('Input was clicked!');
        }}
        onMouseEnter={() => {
          console.log('Mouse entered the input!');
        }}
      />
    );
  }
}
export default Input