import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Убедитесь, что стили Bootstrap Icons подключены
import { BsXCircle, BsFillPencilFill } from "react-icons/bs";
export class User extends React.Component {
  constructor(props) {
    super(props);
    this.user = this.props.user;
    this.state = {
      isEditing: false,
      editedUser: { ...this.props.user },
    };
  }
  handleDelete = () => {
    const { onDelete, user } = this.props;
    if (onDelete) {
      onDelete(user.id); // Передаем id пользователя в родительский компонент
    }
  };
  // handleEdit = () => {
  //   const { onEdit, user } = this.props;
  //   if (onEdit) {
  //     onEdit(user.id); 
  //   }
  // };
  handleEdit = () => {
    this.setState({ isEditing: true });
  };
  handleSave = () => {
    const { onEdit, user } = this.props;
    const { editedUser } = this.state;

    if (onEdit) {
      onEdit(user.id, editedUser);
      this.setState({ isEditing: false });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editedUser: {
        ...prevState.editedUser,
        [name]: value,
      },
    }));
  };
  render() {
    const { isEditing, editedUser } = this.state;

    return (
      <div className="user-card">


        {isEditing ? (
          <div>
            <div className="icon-container">
              <BsFillPencilFill className='edit-icon' onClick={this.handleSave} />
              <BsXCircle className='close-icon' onClick={this.handleDelete} />
            </div>
            
            <input
              type="text"
              name="image"
              value={editedUser.image}
              onChange={this.handleChange}
              placeholder="Image URL"
              className="edit-input"
            />
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={this.handleChange}
              placeholder="Name"
              className="edit-input"
            />
            <textarea
              name="bio"
              value={editedUser.bio}
              onChange={this.handleChange}
              placeholder="Bio"
              className="edit-input"
            />
            <button onClick={this.handleSave} className="save-button">Save</button>
          </div>
        ) : (
          
          <div>
            
            <div className="icon-container">
              <BsFillPencilFill className='edit-icon' onClick={this.handleEdit} />
              <BsXCircle className='close-icon' onClick={this.handleDelete} />
            </div>
            <img src={this.props.user.image} alt={this.props.user.name} className="user-image" />
            <h2>{this.props.user.name}</h2>
            <p>{this.props.user.bio}</p>

          </div>
        )}
        {/* //TODO: 
        
        */}
       
      </div>
    );
  }
}

export default User;
