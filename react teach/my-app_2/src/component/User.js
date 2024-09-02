import React from 'react';

export class User extends React.Component {
  
  constructor(props) {
    super(props);
    // Инициализация массива пользователей и других данных
    this.user=this.props.user
    }

  render(props) {
    
    return (
          
            <div className="user-card"  >
              <img src={this.user.image} alt={this.user.name} className="user-image" />
              <h2>{this.user.name}</h2>
              <p>{this.user.bio}</p>
            </div>
          )
        
  }
}

export default User;
