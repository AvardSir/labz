import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Подключаем AuthContext


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

  // Основная логика для авторизации
  const handleLoginSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setError(""); // Сброс ошибок перед новым запросом
      setIsSubmitting(true); // Инициализация отправки данных

      console.log("Submitting login:", loginData.login, loginData.password); // Логируем login и password в консоль

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
          console.log("Logged in with:", loginData.login, loginData.password); // Логируем успешный вход
          login(loginData.login, loginData.password); // Устанавливаем авторизацию через контекст
          navigate("/"); // Переход на главную страницу
        } else {
          setError("Неверный логин или пароль");
        }
      } catch (err) {
        setError("Ошибка связи с сервером");
        console.error("Ошибка авторизации:", err);
      } finally {
        setIsSubmitting(false); // Завершаем процесс отправки
      }
    },
    [loginData, login, navigate]
  );

  // Логика выхода
  const handleLogout = () => {
    logout(); // Вызываем logout из AuthContext
    setLoginData({ login: "", password: "" }); // Очищаем данные
    navigate("/"); // Переход на главную
  };

  // Переход в личный кабинет
  const handleLK = () => {
    navigate("/personal_cabinet");
  };

  // Автоматическая авторизация при данных из state
  useEffect(() => {
    if (loginData.login && loginData.password && !isLoggedIn) {
      setIsSubmitting(true); // Если есть данные, то сразу начать попытку входа
    }
  }, [loginData, isLoggedIn]);

  useEffect(() => {
    if (isSubmitting) {
      handleLoginSubmit();
    }
  }, [isSubmitting, handleLoginSubmit]);

  // Если уже авторизован
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Авторизация..." : "Войти"}
        </button>
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
