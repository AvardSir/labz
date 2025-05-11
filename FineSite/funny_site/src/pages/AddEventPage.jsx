import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

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
    gap: '1rem',
    marginTop: '2rem',
  },
  primaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#48bb78',
    color: 'white',
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
    margin: '1rem 0',
    textAlign: 'center',
  },
  successMessage: {
    color: '#38a169',
    margin: '1rem 0',
    textAlign: 'center',
  },
};

export const AddEventPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: "",
    cost: "",
    howManyFreeSeats: "",
    name: "",
    conducted: false,
    eventTypeId: "",
  });

  const [eventTypes, setEventTypes] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("/api/events/types");
        const result = await response.json();
        setEventTypes(result);
        if (result.length > 0) {
          setFormData((prev) => ({
            ...prev,
            eventTypeId: result[0].id,
          }));
        }
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить типы мероприятий");
      }
    };

    fetchEventTypes();
  }, []);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const requestData = {
      ...formData,
      cost: parseFloat(formData.cost),
      howManyFreeSeats: parseInt(formData.howManyFreeSeats, 10),
      eventTypeId: parseInt(formData.eventTypeId, 10),
    };

    try {
      const response = await fetch("/api/add_events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ошибка при добавлении мероприятия");
      }

      setSuccessMessage("Мероприятие успешно добавлено!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.form}>
        <h2 style={styles.title}>Добавить мероприятие</h2>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Название:</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>Описание:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="cost" style={styles.label}>Стоимость:</label>
            <input
              type="number"
              step="0.01"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="howManyFreeSeats" style={styles.label}>Свободных мест:</label>
            <input
              type="number"
              id="howManyFreeSeats"
              name="howManyFreeSeats"
              value={formData.howManyFreeSeats}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="eventTypeId" style={styles.label}>Тип мероприятия:</label>
            <select
              id="eventTypeId"
              name="eventTypeId"
              value={formData.eventTypeId}
              onChange={handleChange}
              required
              style={styles.select}
            >
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                id="conducted"
                name="conducted"
                checked={formData.conducted}
                onChange={handleChange}
              />{" "}
              Проведено
            </label>
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
