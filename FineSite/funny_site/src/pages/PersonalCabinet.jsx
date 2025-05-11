import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';

// Стили вынесены в отдельный объект
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#2d3748',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'all 0.2s ease',
  },
  passwordContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  toggleButton: {
    position: 'absolute',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#4a5568',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  primaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    flex: 1,
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    flex: 1,
  },
  errorMessage: {
    color: '#e53e3e',
    marginTop: '1rem',
    textAlign: 'center',
  },
  title: {
    color: 'white',
    marginBottom: '2rem',
  }
};

export const PersonalCabinet = () => {
  const { isLoggedIn, loginData } = useContext(AuthContext); 
  const navigate = useNavigate();
  const {  login, logout } = useContext(AuthContext); // Получаем данные и функции из AuthContext
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
    logout(); // Выход через AuthContext
    navigate("/"); // Переход на главную
  };
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
        alert(data.message);
        handleLogout()
        
      console.log('lol')
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
    <div style={styles.container}>
      <h2 style={styles.title}>Личный кабинет</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Имя
            <input
              type="text"
              name="Name"
              value={userData.Name}
              required
              onChange={handleInputChange}
              style={styles.input}
            />
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Пароль
            <div style={styles.passwordContainer}>
              <input
                type={passwordVisible ? "text" : "password"}
                name="Password"
                value={userData.Password}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.toggleButton}
              >
                {passwordVisible ? "🙈 Скрыть" : "👁️ Показать"}
              </button>
            </div>
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              name="Email"
              value={userData.Email}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Биография
            <textarea
              name="Bio"
              value={userData.Bio}
              onChange={handleInputChange}
              style={styles.textarea}
            />
          </label>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            style={styles.primaryButton}
            
          >
            Сохранить изменения
          </button>
          <button 
            type="button" 
            style={styles.primaryButton}
            onClick={() => navigate('/')}
          >
            Назад
          </button>
        </div>
      </form>

      {error && <p style={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default PersonalCabinet;