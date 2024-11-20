import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext"; // Укажите правильный путь до AuthContext

export const PersonalCabinet = () => {
  const { isLoggedIn, loginData } = useContext(AuthContext); // Получаем данные авторизации из контекста
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    IdUser: null,  // Добавляем IdUser
    Name: "",
    Password: "",
    Email: "",
    Bio: "",
    initialName: "",  // Добавляем поле для инициализации имени
  });

  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Состояние для видимости пароля

  // Инициализация данных пользователя из AuthContext и получение данных с сервера
  useEffect(() => {
    if (isLoggedIn && loginData) {
      // Делаем запрос к серверу для получения данных о пользователе
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user?login=${loginData.login}&password=${loginData.password}`);
          if (response.ok) {
            const data = await response.json();
            setUserData({
              IdUser: data.IdUser,  // Получаем IdUser с сервера
              Name: data.Name,
              Password: data.Password,
              Email: data.Email,
              Bio: data.Bio,
              initialName: data.Name,  // Инициализируем initialName
            });
          } else {
            const result = await response.json();
            setError(result.message || "Ошибка при получении данных");
          }
        } catch (err) {
          setError("Ошибка связи с сервером");
          console.error("Ошибка запроса:", err);
        }
      };

      fetchUserData();
    } else {
      navigate("/"); // Если пользователь не авторизован, перенаправляем на страницу входа
    }
  }, [isLoggedIn, loginData, navigate]);

  // Обработчик изменений в форме
  const handleInputChange = ({ target: { name, value } }) => {
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Функция для проверки уникальности имени пользователя
  const checkNameUniqueness = async (name) => {
    try {
      const response = await fetch(`/api/check-name?name=${name}`);
      if (response.ok) {
        const data = await response.json();
        return data.isUnique; // Возвращаем булево значение, если имя уникально
      } else {
        const result = await response.json();
        setError(result.message || "Ошибка при проверке уникальности имени");
        return false;
      }
    } catch (err) {
      setError("Ошибка связи с сервером");
      console.error("Ошибка проверки имени:", err);
      return false;
    }
  };

  // Отправка данных на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очищаем старые ошибки

    // Если имя изменилось, проверяем его уникальность
    if (userData.Name !== userData.initialName) {
      console.log(userData.Name);
      console.log(userData.initialName);
      const isNameUnique = await checkNameUniqueness(userData.Name);
      if (!isNameUnique) {
        setError("Имя пользователя уже занято.");
        return;
      }
    }

    try {
      const response = await fetch("/api/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdUser: userData.IdUser, // Добавляем IdUser в запрос
          Name: userData.Name,
          Password: userData.Password,
          Email: userData.Email,
          Bio: userData.Bio,
        }), // Отправляем обновленные данные с IdUser
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Сообщение об успешном обновлении
      } else {
        setError(result.message || "Ошибка при обновлении данных");
      }
    } catch (err) {
      setError("Ошибка связи с сервером");
      console.error("Ошибка обновления:", err);
    }
  };

  // Переключение видимости пароля
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="personal-cabinet">
      <h2>Личный кабинет</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Имя:
            <input
              type="text"
              name="Name"
              value={userData.Name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Пароль:
            <div style={{ position: 'relative' }}>
              <input
                type={passwordVisible ? "text" : "password"} // Переключаем тип поля
                name="Password"
                value={userData.Password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {passwordVisible ? "Скрыть" : "Показать"}
              </button>
            </div>
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="Email"
              value={userData.Email}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Биография:
            <textarea
              name="Bio"
              value={userData.Bio}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">Сохранить изменения</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PersonalCabinet;
