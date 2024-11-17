import React, { useState } from "react";
import "../css/RegistrationForm.css";

export const RegistrationForm = () => {
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegistrationChange = ({ target: { name, value } }) => {
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    console.log("Регистрация:", registrationData);
    setRegistrationData({ name: "", email: "", password: "" }); // Очистка формы
  };

  return (
    <section className="registration">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegistrationSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={registrationData.name}
          onChange={handleRegistrationChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registrationData.email}
          onChange={handleRegistrationChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={registrationData.password}
          onChange={handleRegistrationChange}
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </section>
  );
};
