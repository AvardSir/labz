import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  // Fetch event types for the dropdown
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("/api/events/types"); // Replace with your actual endpoint
        const result = await response.json();
        setEventTypes(result);

        // Set default event type if available
        if (result.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            eventTypeId: result[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching event types:", error);
        setError("Failed to load event types.");
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
        throw new Error(result.error || "Failed to add the event.");
      }

      setSuccessMessage("Event successfully added!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-event">
      <h2>Добавить мероприятие</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Название мероприятия:</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cost">Стоимость:</label>
          <input
            type="number"
            step="0.01"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="howManyFreeSeats">Доступные места:</label>
          <input
            type="number"
            id="howManyFreeSeats"
            name="howManyFreeSeats"
            value={formData.howManyFreeSeats}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventTypeId">Тип мероприятия:</label>
          <select
            id="eventTypeId"
            name="eventTypeId"
            value={formData.eventTypeId}
            onChange={handleChange}
            required
          >
            {eventTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="conducted">
            <input
              type="checkbox"
              id="conducted"
              name="conducted"
              checked={formData.conducted}
              onChange={handleChange}
            />
            Проведено
          </label>
        </div>

        <button type="submit">Добавить мероприятие</button>
      </form>
    </div>

  );
};
