import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Убедитесь, что стили Bootstrap Icons подключены
import { IconName } from "react-icons/bs";
import { Bs0CircleFill } from "react-icons/bs";
export class User extends React.Component {
  constructor(props) {
    super(props);
    this.user = this.props.user;
  }
  handleDelete = () => {
    const { onDelete, user } = this.props;
    if (onDelete) {
      onDelete(user.id); // Передаем id пользователя в родительский компонент
    }
  };

  render() {
    return (
      <div className="user-card">
        {/* <Bs0CircleFill className='close-icon'/> */}

        <img src={this.user.image} alt={this.user.name} className="user-image" />
        <h2>{this.user.name}</h2>
        <p>{this.user.bio}</p>
      </div>
    );
  }
}

export default User;
