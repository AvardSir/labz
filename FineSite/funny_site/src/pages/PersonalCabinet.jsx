import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';

export const PersonalCabinet = () => {
  const { isLoggedIn, loginData } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    IdUser: null,
    Name: "",
    Password: "",
    Email: "",
    Bio: "",
    initialName: "",
  });

  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Получаем данные пользователя после входа
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
              Password: data.Password,
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
      navigate('/'); // Перенаправление на страницу входа
    }
  }, [isLoggedIn, loginData, navigate]);

  const handleInputChange = ({ target: { name, value } }) => {
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Обработчик отправки данных на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IdUser: userData.IdUser,
          Name: userData.Name,
          Password: userData.Password,
          Email: userData.Email,
          Bio: userData.Bio,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Показываем сообщение об успехе
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
    <div className="personal-cabinet">
      <h2>Личный кабинет</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            name="Name"
            value={userData.Name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Пароль:</label>
          <div style={{ position: 'relative' }}>
            <input
              type={passwordVisible ? "text" : "password"}
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
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={userData.Email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Биография:</label>
          <textarea
            name="Bio"
            value={userData.Bio}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Сохранить изменения</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PersonalCabinet;
