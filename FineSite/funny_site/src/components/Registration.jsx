import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  successMessage: {
    color: '#38a169',
    marginTop: '1rem',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#e53e3e',
    marginTop: '1rem',
    textAlign: 'center',
  },
  title: {
    color: '#2d3748',
    marginBottom: '2rem',
  }
};

const Registration = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Password: '',
    Email: '',
    Bio: '',
    IdRights: 1,
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/add-user', formData);

      setMessage(response.data.message);
      navigate('/', { 
        state: { 
          login: formData.Name, 
          password: formData.Password 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сервера');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: 'white' }}>Регистрация</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Имя
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
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
                value={formData.Password}
                onChange={handleChange}
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
              value={formData.Email}
              onChange={handleChange}
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
              value={formData.Bio}
              onChange={handleChange}
              style={styles.textarea}
            />
          </label>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            type="submit"
            style={styles.primaryButton}
          >
            Зарегистрироваться
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

      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Registration;