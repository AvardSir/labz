import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Подключаем AuthContext
import "../css/RegistrationForm.css";

export const Autification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useContext(AuthContext); // Получаем функции из AuthContext

  const [loginData, setLoginData] = useState({
    login: location.state?.login || "",
    password: location.state?.password || "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginChange = ({ target: { name, value } }) => {
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setError("");
      setIsSubmitting(false);

      try {
        const response = await fetch("/api/users/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        const user = result.find(
          (user) =>
            user.Name === loginData.login && user.Password === loginData.password
        );

        if (user) {
          login(); // Устанавливаем авторизацию через контекст
          navigate("/"); // Переход на главную страницу
        } else {
          setError("Неверный логин или пароль");
        }
      } catch (err) {
        setError("Ошибка связи с сервером");
        console.error("Ошибка авторизации:", err);
      }
    },
    [loginData, navigate, login]
  );

  const handleLogout = () => {
    logout(); // Вызываем logout из AuthContext
    setLoginData({ login: "", password: "" }); // Очищаем данные
    navigate("/"); // Переход на главную
  };

  const handleLK = () => {
    navigate("/personal_cabinet");
  };

  // Автоматическая авторизация при данных из state
  useEffect(() => {
    if (loginData.login && loginData.password && !isLoggedIn) {
      setIsSubmitting(true);
    }
  }, [loginData, isLoggedIn]);

  useEffect(() => {
    if (isSubmitting) {
      handleLoginSubmit();
    }
  }, [isSubmitting, handleLoginSubmit]);

  if (isLoggedIn) {
    return (
      <section className="registration">
        <h2>Вы успешно авторизованы!</h2>
        <button onClick={handleLogout}>Выйти</button>
        <button onClick={handleLK}>В личный кабинет</button>
      </section>
    );
  }

  return (
    <section className="registration">
      <h2>Авторизация</h2>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          name="login"
          placeholder="Логин"
          value={loginData.login}
          onChange={handleLoginChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={loginData.password}
          onChange={handleLoginChange}
        />
        <button type="submit">Войти</button>
      </form>
      <div>
        <p>Нет аккаунта? 
          <button
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            <Link
              to="/registration"
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Зарегистрируйтесь
            </Link>
          </button>
        </p>
      </div>
      {error && <p className="error-message">{error}</p>}
    </section>
  );
};
