// PersonalCabinet.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PersonalCabinet = () => {
  const [userData, setUserData] = useState({
    Name: '',
    Password: '',
    Email: '',
    Bio: '',
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Получаем данные пользователя при монтировании компонента (например, из локального хранилища или API)
  useEffect(() => {
    // Здесь можно получить данные пользователя (например, из контекста, Redux, или API)
    // Для примера берем данные из localStorage:
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      setUserData({
        Name: user.Name,
        Password: user.Password,
        Email: user.Email,
        Bio: user.Bio,
      });
    } else {
      navigate("/login"); // Если пользователь не авторизован, переходим на страницу входа
    }
  }, [navigate]);

  // Обработчик изменений в форме
  const handleInputChange = ({ target: { name, value } }) => {
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Отправка данных на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очищаем старые ошибки

    try {
      const response = await fetch('/api/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IdUser: userData.IdUser, // Здесь нужно передавать уникальный ID пользователя
          Name: userData.Name,
          Password: userData.Password,
          Email: userData.Email,
          Bio: userData.Bio,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Сообщение об успешном обновлении
      } else {
        setError(result.message || 'Ошибка при обновлении данных');
      }
    } catch (err) {
      setError('Ошибка связи с сервером');
      console.error('Ошибка обновления:', err);
    }
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
            <input
              type="password"
              name="Password"
              value={userData.Password}
              onChange={handleInputChange}
            />
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

export default PersonalCabinet; // Экспортируем компонент как default
