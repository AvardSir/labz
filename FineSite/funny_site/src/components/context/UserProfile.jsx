// src/components/UserProfile.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UserProfile = () => {
  const { userDetails, isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <p>Пожалуйста, войдите для просмотра профиля.</p>;
  }

  return (
    <div>
      <h2>Профиль</h2>
      <p>Имя: {userDetails.Name}</p>
      <p>Email: {userDetails.Email}</p>
      <p>Биография: {userDetails.Bio}</p>
    </div>
  );
};

export default UserProfile;
