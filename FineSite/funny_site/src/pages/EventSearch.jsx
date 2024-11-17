// EventSearch.jsx
import React, { useState, useEffect } from "react";

export const EventSearch = ({ searchData, setSearchData, setFoundEvents, handleSearchEvents }) => {
  const [eventTypes, setEventTypes] = useState([]);

  // Получение типов мероприятий при загрузке компонента
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("/api/events/types");
        const result = await response.json();
        setEventTypes(result); // Сохраняем типы мероприятий
        if (result.length > 0) {
          setSearchData((prevData) => ({ ...prevData, event: result[0].id }));
        }
      } catch (error) {
        console.error("Ошибка при получении типов мероприятий:", error);
      }
    };

    fetchEventTypes();
  }, []);

  const handleSearchChange = ({ target: { name, value } }) => {
    setSearchData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearchButtonClick = async () => {
    const { event } = searchData;
    try {
      const response = await fetch(
        `/api/events/by-type?idTypeEvent=${encodeURIComponent(event)}`
      );
      const result = await response.json();
      setFoundEvents(Array.isArray(result) ? result : []);
      handleSearchEvents(); // Вызываем handleSearchEvents у родителя
    } catch (error) {
      console.error("Ошибка при поиске мероприятий:", error);
      setFoundEvents([]);
    }
  };

  return (
    <div className="search-box">
      <h3>По типу мероприятия</h3>
      <select
        name="event"
        value={searchData.event}
        onChange={handleSearchChange}
      >
        {eventTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      <button onClick={handleSearchButtonClick}>Поиск мероприятий</button>
    </div>
  );
};
