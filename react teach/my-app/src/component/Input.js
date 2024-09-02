import React from 'react';
class Input extends React.Component {


  constructor(props) {
    super(props) //this props maybe mistake?
    this.state = {
      textPlaceholder: 'Тестушка',
      userData: ""
    }
    // this.onClick_=this.this.onClick_.bind(this)
  }

  onClick = () => {
    this.setState(prevState => ({
      textPlaceholder: prevState.textPlaceholder === 'Салам' ? 'Алейкум' : 'Салам'
    }));
    console.log('Input was clicked!');
  }
  render() {

    return (
      <div>
        <input
          onChange={(event) => {
            const newValue = event.target.value;
            this.setState({ userData: newValue }, () => {
              // Функция обратного вызова, которая выполняется после обновления состояния
              console.log(this.state.userData);
            });
          }
          }
          placeholder={this.state.textPlaceholder}
          onClick={this.onClick}
          onMouseEnter={() => {
            console.log('Mouse entered the input!');
          }}
        />
      </div>
    );
  }
}
export default Input