// src/components/Logout.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};

export default Logout;
