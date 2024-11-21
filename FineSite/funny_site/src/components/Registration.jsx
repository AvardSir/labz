import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Для навигации
import axios from 'axios';

const Registration= () => {
  const [formData, setFormData] = useState({
    Name: '',
    Password: '',
    Email: '',
    Bio: '',
    IdRights: 1, // По умолчанию
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // Состояние для видимости пароля
  const navigate = useNavigate(); // Для навигации

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/users', formData);
      setMessage(response.data.message);
      // Навигация на страницу аутентификации с передачей данных
      navigate('/', { state: { login: formData.Name, password: formData.Password } });
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сервера');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Переключаем видимость пароля
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Имя:
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Пароль:
            <div style={{ position: 'relative' }}>
              <input
                type={passwordVisible ? "text" : "password"} // Переключаем тип поля
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
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
        <div style={{ marginBottom: '10px' }}>
          <label>
            Email:
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Биография:
            <textarea
              name="Bio"
              value={formData.Bio}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          Зарегистрироваться
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '20px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
};

export default Registration;