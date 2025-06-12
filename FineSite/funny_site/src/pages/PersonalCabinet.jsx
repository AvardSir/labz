import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';

export const PersonalCabinet = () => {
  const { isLoggedIn, loginData } = useContext(AuthContext);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    IdUser: null,
    Name: "",
    Password: "", // пароль пустой по умолчанию
    Email: "",
    Bio: "",
    initialName: "",
  });

  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (isLoggedIn && loginData?.login) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/GetUserDetailsByNameAndPassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              login: loginData.login,
              password: loginData.password,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setUserData({
              IdUser: data.IdUser,
              Name: data.Name,
              Password: "", // НЕ записываем пароль из ответа, чтобы поле было пустым
              Email: data.Email,
              Bio: data.Bio,
              initialName: data.Name,
            });
          } else {
            setError("Ошибка при получении данных");
          }
        } catch (err) {
          setError("Ошибка связи с сервером");
          console.error("Ошибка запроса:", err);
        }
      };

      fetchUserData();
    } else {
      navigate('/');
    }
  }, [isLoggedIn, loginData, navigate]);

  const handleInputChange = ({ target: { name, value } }) => {
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Формируем тело запроса, не включая пароль, если он пустой
    const bodyToSend = {
      IdUser: userData.IdUser,
      Name: userData.Name,
      Email: userData.Email,
      Bio: userData.Bio,
    };

    if (userData.Password.trim() !== "") {
      // если пароль введён — добавляем в тело запроса
      bodyToSend.Password = userData.Password;
    }

    try {
      const response = await fetch('/api/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyToSend),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        handleLogout();
      } else {
        setError("Ошибка при сохранении данных");
      }
    } catch (err) {
      setError("Ошибка связи с сервером");
      console.error("Ошибка запроса:", err);
    }
  };

  if (!userData.IdUser) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="personal-cabinet-container">
      <h2 className="personal-cabinet-title">Личный кабинет</h2>
      <form onSubmit={handleSubmit} className="personal-cabinet-form">
        <div className="personal-cabinet-form-group">
          <label className="personal-cabinet-label">
            Имя
            <input
              type="text"
              name="Name"
              value={userData.Name}
              required
              onChange={handleInputChange}
              className="personal-cabinet-input"
            />
          </label>
        </div>

        <div className="personal-cabinet-form-group">
          <label className="personal-cabinet-label">
            Задайте новый пароль
            <div className="personal-cabinet-password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                name="Password"
                value={userData.Password}
                onChange={handleInputChange}
                className="personal-cabinet-input"
                placeholder="Введите новый пароль"
                
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="personal-cabinet-toggle-button"
                aria-label={passwordVisible ? "Скрыть пароль" : "Показать пароль"}
              >
                {passwordVisible ? "🙈 Скрыть" : "👁️ Показать"}
              </button>
            </div>
            <small className="personal-cabinet-hint">
              Оставьте пустым, если не хотите менять пароль
            </small>
          </label>
        </div>

        <div className="personal-cabinet-form-group">
          <label className="personal-cabinet-label">
            Email
            <input
              type="email"
              name="Email"
              value={userData.Email}
              onChange={handleInputChange}
              required
              className="personal-cabinet-input"
            />
          </label>
        </div>

        <div className="personal-cabinet-form-group">
          <label className="personal-cabinet-label">
            Биография
            <textarea
              name="Bio"
              value={userData.Bio}
              onChange={handleInputChange}
              className="personal-cabinet-textarea"
            />
          </label>
        </div>

        <div className="personal-cabinet-button-group">
          <button
            type="submit"
            className="personal-cabinet-primary-button"
          >
            Сохранить изменения
          </button>
          <button
            type="button"
            className="personal-cabinet-primary-button"
            onClick={() => navigate('/')}
          >
            Назад
          </button>
        </div>
      </form>

      {error && <p className="personal-cabinet-error-message">{error}</p>}
    </div>
  );
};

export default PersonalCabinet;
