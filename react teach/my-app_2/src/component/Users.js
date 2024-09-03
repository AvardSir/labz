import React from 'react';
import User from './User';
export class Users extends React.Component {
  
  handleDelete = (id) => {
    this.setState(prevState => ({
      users: prevState.users.filter(user => user.id !== id)
    }));
  }
  
  render() {
    return (
      <div className="user-list">
        {
          this.props.users.map((el) => (
            <User user={el} key={el.id} onDelete={this.handleDelete} />
          ))
        }
      </div>
    );
  }
  
}

export default Users;
