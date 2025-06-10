import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Header } from "../components/Header";
import { AudioUploader } from "./AudioUploader";
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '100vh',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#2d3748',
    marginBottom: '2rem',
    textAlign: 'center',
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
    minHeight: '150px',
    transition: 'all 0.2s ease',
    lineHeight: '1.6',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'all 0.2s ease',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
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
    minWidth: '140px',
  },
  errorMessage: {
    color: '#e53e3e',
    margin: '1rem 0',
    textAlign: 'center',
  },
  successMessage: {
    color: '#38a169',
    margin: '1rem 0',
    textAlign: 'center',
  },
};

export const AddAnecdoteComponent = () => {
  const { loginData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [audioFile, setAudioFile] = useState(null);
  const [tempAudioFile, setTempAudioFile] = useState(null); // временное хранение файла до отправки

  const [formData, setFormData] = useState({
    Text: "",
    Rate: 1,
    IdTypeAnecdote: "",
  });

  const [anecdoteTypes, setAnecdoteTypes] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnecdoteTypes = async () => {
      try {
        const response = await fetch("/api/anecdotes/types");
        const result = await response.json();
        setAnecdoteTypes(result);

        if (result.length > 0) {
          setFormData((prev) => ({
            ...prev,
            IdTypeAnecdote: result[0].id,
          }));
        }
      } catch (err) {
        console.error("Ошибка при получении типов анекдотов:", err);
        setError("Не удалось загрузить типы анекдотов");
      }
    };

    fetchAnecdoteTypes();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // 1. Сначала добавляем анекдот
      const response = await fetch("/api/add-anecdote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          Rate: Number(formData.Rate),
          IdTypeAnecdote: Number(formData.IdTypeAnecdote),
          IdUser: loginData.IdUser,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Ошибка при добавлении");

      const addedId = result.IdAnecdote;
      console.log('Created anecdote ID:', addedId);

      // 2. Если есть аудиофайл - загружаем его
      if (tempAudioFile && addedId) {
        const formData = new FormData();
        formData.append("audio", tempAudioFile);
        formData.append("IdAnecdote", addedId.toString()); // Явное преобразование в строку

        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }


        const uploadResp = await fetch(`/api/upload-audio?id=${addedId}`, {
          method: 'POST',
          body: formData
        });


        if (!uploadResp.ok) {
          const errorData = await uploadResp.json();
          throw new Error(errorData.error || "Ошибка при загрузке аудио");
        }
      }

      setSuccessMessage("Анекдот успешно добавлен!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleFileSelect = (file) => {
    setTempAudioFile(file);
  };


  return (
    <div style={styles.container}>

      <div style={styles.form}>
        <h2 style={styles.title}>Добавить анекдот</h2>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="Text" style={styles.label}>Текст анекдота:</label>
            <textarea
              id="Text"
              name="Text"
              value={formData.Text}
              onChange={handleChange}
              required
              style={styles.textarea}
            />
          </div>



          <div style={styles.formGroup}>
            <label htmlFor="IdTypeAnecdote" style={styles.label}>Тип анекдота:</label>
            <select
              id="IdTypeAnecdote"
              name="IdTypeAnecdote"
              value={formData.IdTypeAnecdote}
              onChange={handleChange}
              required
              style={styles.select}
            >
              {anecdoteTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.primaryButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Добавление..." : "Добавить"}
            </button>
            <AudioUploader onFileSelect={handleFileSelect} />


            <button
              type="button"
              onClick={() => navigate("/")}
              style={styles.primaryButton}
            >
              Назад
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
