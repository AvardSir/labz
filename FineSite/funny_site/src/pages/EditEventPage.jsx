import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header"; // Используем именованный импорт
const EditEventPage = () => {
  const { id } = useParams(); // Извлекаем IdEvent из параметров маршрута
  const [event, setEvent] = useState({
    Name: "",
    Description: "",
    Cost: "",
    HowManyFreeSeats: "",
    Conducted: false,
    EventTypeId: "",
  });
  const [eventTypes, setEventTypes] = useState([]); // Для хранения типов мероприятий
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Для навигации после обновления

  useEffect(() => {
    if (!id) {
      setError("Id мероприятия не найдено");
      return;
    }

    // Функция для загрузки типов мероприятий
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get("/api/event-types"); // Ваш API для получения типов
        setEventTypes(response.data); // Сохраняем типы мероприятий в состояние
      } catch (err) {
        console.error("Ошибка при загрузке типов мероприятий", err);
        setError("Ошибка при загрузке типов мероприятий");
      }
    };

    // Функция для загрузки данных мероприятия
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/event-details/${id}`);
        setEvent(response.data[0]);
      } catch (err) {
        console.error("Ошибка при загрузке данных мероприятия", err);
        setError("Ошибка при загрузке данных мероприятия");
      }
    };

    fetchEventTypes(); // Загружаем типы мероприятий
    fetchEventDetails(); // Загружаем данные мероприятия
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: value,
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
        cost: event.Стоимость,
        howManyFreeSeats: event.HowManyFreeSeats,
        name: event.Name,
        conducted: event.Проведено,
        eventTypeId: event.EventTypeId,
      });
      alert(response.data.message); // Сообщение от сервера
      navigate("/"); // Перенаправление на главную страницу
    } catch (err) {
      console.error("Ошибка при обновлении мероприятия", err);
      setError("Ошибка при обновлении мероприятия");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>{error}</p>;

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <Header/>
      {console.log(event)}
      <h1>Редактировать мероприятие</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Name">Название мероприятия:</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={event.Name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Description">Описание:</label>
          <textarea
            id="Description"
            name="Description"
            value={event.Description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Cost">Стоимость:</label>
          <input
            type="number"
            id="Cost"
            name="Cost"
            value={event.Стоимость}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="HowManyFreeSeats">Количество свободных мест:</label>
          <input
            type="number"
            id="HowManyFreeSeats"
            name="HowManyFreeSeats"
            value={event.HowManyFreeSeats}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Conducted">Проведено:</label>
          <input
            type="checkbox"
            id="Conducted"
            name="Conducted"
            checked={event.Проведено}
            onChange={(e) => handleChange({ target: { name: "Conducted", value: e.target.checked } })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="EventTypeId">Тип мероприятия:</label>
          <select
            id="EventTypeId"
            name="EventTypeId"
            value={event.EventTypeId}
            onChange={handleChange}
            required
          >
            
            {eventTypes.map((type) => (
              <option key={type.Id} value={type.Id}>
                {type.EventTypeName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
