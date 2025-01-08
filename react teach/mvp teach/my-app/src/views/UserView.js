import React from "react";

export const UserView = ({ user, onUpdate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };
// йойойо
  return (
    <div>
      <h1>User Profile</h1>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Age:
        <input
          type="number"
          name="age"
          value={user.age}
          onChange={handleChange}
        />
      </label>
      <p>
        Current user: {user.name}, {user.age} years old
      </p>
    </div>
  );
};
