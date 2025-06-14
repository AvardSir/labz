import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

const styles = {
  container: {

    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '100vh',
        textShadow: 'none' // Убирает тень текста


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
    minHeight: '120px',
    transition: 'all 0.2s ease',
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
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkbox: {
    width: '1.2rem',
    height: '1.2rem',
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

const EditEventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({
    Name: "",
    Description: "",
    Cost: "",
    HowManyFreeSeats: "",
    Conducted: false,
    EventTypeId: "",
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Id мероприятия не найдено");
      return;
    }

    const fetchEventTypes = async () => {
      try {
        const response = await axios.get("/api/event-types");
        setEventTypes(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке типов мероприятий", err);
        setError("Ошибка при загрузке типов мероприятий");
      }
    };

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/event-details/${id}`);
        const data = response.data[0];
        console.log(data)
        setEvent({
          Name: data.Name || "",
          Description: data.Description || "",
          Cost: data.Стоимость || "",
          HowManyFreeSeats: data.HowManyFreeSeats || "",
          Conducted: data.Проведено || false,
          EventTypeId: data.EventTypeId || "",
        });
      } catch (err) {
        console.error("Ошибка при загрузке данных мероприятия", err);
        setError("Ошибка при загрузке данных мероприятия");
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
    fetchEventDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put("/api/update_event", {
        idEvent: id,
        description: event.Description,
        cost: event.Cost,
        howManyFreeSeats: event.HowManyFreeSeats,
        name: event.Name,
        conducted: event.Conducted,
        eventTypeId: event.EventTypeId,
      });
      // alert(response.data.message);
      navigate("/events");
    } catch (err) {
      console.error("Ошибка при обновлении мероприятия", err);
      setError("Ошибка при обновлении мероприятия");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p style={styles.errorMessage}>{error}</p>;
  if (loading) return <p style={styles.loadingText}>Загрузка...</p>;

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.form}>
        <h2 style={styles.title}>Редактировать мероприятие</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="Name" style={styles.label}>
              Название мероприятия:
            </label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={event.Name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="Description" style={styles.label}>
              Описание:
            </label>
            <textarea
              id="Description"
              name="Description"
              value={event.Description}
              onChange={handleChange}
              required
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>

            {/* {console.log(event)} */}

            {/* {console.log(data.Cost)} */}
            <label htmlFor="Cost" style={styles.label}>
              Стоимость:
            </label>
            <input
              type="number"
              id="Cost"
              name="Cost"
              value={event.Cost}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="HowManyFreeSeats" style={styles.label}>
              Количество свободных мест:
            </label>
            <input
              type="number"
              id="HowManyFreeSeats"
              name="HowManyFreeSeats"
              value={event.HowManyFreeSeats}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="Conducted"
                name="Conducted"
                checked={event.Conducted}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <label htmlFor="Conducted" style={styles.label}>
                Проведено
              </label>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="EventTypeId" style={styles.label}>
              Тип мероприятия:
            </label>
            <select
              id="EventTypeId"
              name="EventTypeId"
              value={event.EventTypeId}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Выберите тип</option>
              {eventTypes.map((type) => (
                <option key={type.Id} value={type.Id}>
                  {type.EventTypeName}
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
              onClick={() => navigate('/events')}
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

export default EditEventPage;