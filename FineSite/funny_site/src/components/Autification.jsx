import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Подключаем AuthContext

export const Autification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login, logout, loginData } = useContext(AuthContext); // Получаем данные и функции из AuthContext

  const [localLoginData, setLocalLoginData] = useState({
    login: location.state?.login || loginData?.login || "",
    password: location.state?.password || loginData?.password || "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginChange = ({ target: { name, value } }) => {
    setLocalLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(""); // Сброс ошибок перед новым запросом
      setIsSubmitting(true); // Инициализация отправки данных

      console.log("Submitting login:", localLoginData.login, localLoginData.password); // Логируем login и password в консоль

      try {
        const response = await fetch("/api/users/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        const user = result?.find(
          (user) =>
            user.Name === localLoginData.login &&
            user.Password === localLoginData.password
        );

        if (user) {
          console.log("Logged in with:", localLoginData.login, localLoginData.password);
          login(localLoginData.login, localLoginData.password, user.IdRights); // Авторизация через контекст
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
    [localLoginData, login, navigate]
  );

  const handleLogout = () => {
    logout(); // Выход через AuthContext
    navigate("/"); // Переход на главную
  };

  const handleLK = () => {
    navigate("/personal_cabinet"); // Переход в личный кабинет
  };

  if (isLoggedIn) {
    return (
      <section className="registration">
        <h2>
        {console.log(loginData.IdRights!=1)}
          Вы успешно авторизованы!
          {loginData?.IdRights != 1 && " Добро пожаловать, администратор!"}
        </h2>
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
          value={localLoginData.login}
          onChange={handleLoginChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={localLoginData.password}
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