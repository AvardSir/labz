import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../context/AuthContext";
import { EventCard } from "./EventCard";
import { Footer } from "../Footer";


export const FoundEvents = ({ events, fetchEvents, setFoundEvents }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);

  const handleDelete = async (eventId) => {
    try {
      const response = await axios.delete(`/api/delete_event/${eventId}`);
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении мероприятия:", error.response?.data || error);
      alert(error.response?.data?.error || "Ошибка при удалении мероприятия");
    }
  };

  return (
    <div className="found-events">
      <button onClick={fetchEvents} className="action-btn">
        Сбросить поиск по типам
      </button>

      {loginData.IdRights === 2 && (
        <button
          onClick={() => navigate(`/add-event`)}
          className="action-btn add-btn"
        >
          ✚ Добавить мероприятие
        </button>
      )}

      <h3>Найденные мероприятия</h3>

      {events.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <ul>
          {events.map((event) => (
            <EventCard
              key={event.IdEvent}
              event={event}
              onDelete={handleDelete}
              navigate={navigate}
              canEdit={loginData.IdRights == 2}
              setFoundEvents={setFoundEvents}
            />
          ))}
        </ul>
      )}
      <Footer />
    </div>
  );
};
