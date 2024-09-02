import React from 'react';
class Button extends React.Component {


  render(props) {
    
    return (
        
        <button>{this.props.text}</button>

    );
  }
}
Button.defaultProps={
    text: "Кнопка"
}

export default Button