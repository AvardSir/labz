import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpButton } from "./SignUpButton";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import { EventTypeTag } from "./foundEvent/EventTypeTag";
export const FoundEvents = ({ events,fetchEvents ,setFoundEvents}) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);

  const handleDelete = async (eventId) => {
  try {
    // console.log(eventId)
    const response = await axios.delete(`/api/delete_event/${eventId}`);
    alert(response.data.message);
    window.location.reload();
  } catch (error) {
    console.error("Ошибка при удалении мероприятия:", error.response?.data || error);
    alert(error.response?.data?.error || "Ошибка при удалении мероприятия");
  }
};

  return  <div className="found-events">
    <button onClick={fetchEvents} className="action-btn"> 
        Сбросить поиск по типам
      </button>
  {loginData.IdRights == 2 && (
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
        <li key={event.IdEvent} className="card">
        <h4 className="card-title">{event.Name}</h4>
        <div className="card-content">
          <p>{event.Description}</p>
        </div>
        
        <div className="card-meta">
          
          <EventTypeTag type={event.ТипМероприятия} IdEvent={event.IdEvent} setFoundEvents={setFoundEvents}/>
          <span>💰 {event.Стоимость} ₽</span>
          <span>🪑 {event.HowManyFreeSeats} мест</span>
          <span>📅 {new Date(event.Date).toLocaleDateString()}</span>
          
          <span>{event.Проведено === true ? '✅ Проведено' : '🕒 Запланировано'}</span>
        </div>
          
          {/* Блок кнопок */}
          <div className="action-buttons">
            <button
              onClick={() => navigate(`/event-comments/${event.IdEvent}`)}
              className="action-btn"
            >
              💬 Комментарии
            </button>

            <SignUpButton 
              eventId={event.IdEvent} 
              className="action-btn signup-btn"
            />

            {loginData.IdRights == 2 && (
              <>
                <button
                  onClick={() => navigate(`/edit-event/${event.IdEvent}`)}
                  className="action-btn edit-btn"
                >
                  ✏️ Изменить
                </button>
                <button
                  onClick={() => handleDelete(event.IdEvent)}
                  className="action-btn delete-btn"
                >
                  🗑️ Удалить
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
};