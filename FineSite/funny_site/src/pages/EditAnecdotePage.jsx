import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";

// Стили (можно вынести в отдельный файл)
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
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '200px',
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
    gap: '1rem',
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
  loadingText: {
    textAlign: 'center',
    color: '#4a5568',
    fontStyle: 'italic',
  },
  errorMessage: {
    color: '#e53e3e',
    margin: '1rem 0',
    textAlign: 'center',
  },
};

export const EditAnecdotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Text: "",
    Rate: "",
    IdTypeAnecdote: "",
  });
  const [anecdoteTypes, setAnecdoteTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnecdoteTypes = async () => {
      try {
        const response = await fetch("/api/anecdotes/types");
        if (!response.ok) throw new Error("Ошибка при загрузке типов анекдотов");
        setAnecdoteTypes(await response.json());
      } catch (error) {
        console.error(error);
        setError("Не удалось загрузить типы анекдотов");
      }
    };

    fetchAnecdoteTypes();
  }, []);

  useEffect(() => {
    const fetchAnecdote = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/anecdotes/${id}`);
        if (!response.ok) throw new Error("Ошибка при загрузке анекдота");
        const data = await response.json();
        setFormData({
          Text: data.Text || "",
          Rate: data.Rate || "",
          IdTypeAnecdote: data.IdTypeAnecdote || "",
        });
      } catch (error) {
        console.error(error);
        setError("Не удалось загрузить анекдот");
      } finally {
        setLoading(false);
      }
    };

    fetchAnecdote();
  }, [id]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await fetch("/api/update-anecdote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IdAnecdote: id,
          NewText: formData.Text,
          NewRate: parseInt(formData.Rate, 10),
          NewIdTypeAnecdote: parseInt(formData.IdTypeAnecdote, 10),
        }),
      });
      if (!response.ok) throw new Error("Ошибка при обновлении анекдота");
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Не удалось обновить анекдот");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.form}>
        <h2 style={styles.title}>Редактировать анекдот</h2>
        
        {loading && <p style={styles.loadingText}>Загрузка...</p>}
        {error && <p style={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="Text" style={styles.label}>
              Текст анекдота:
            </label>
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
            <label htmlFor="IdTypeAnecdote" style={styles.label}>
              Тип анекдота:
            </label>
            <select
              id="IdTypeAnecdote"
              name="IdTypeAnecdote"
              value={formData.IdTypeAnecdote}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Выберите тип</option>
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
              {loading ? "Сохранение..." : "Сохранить изменения"}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
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