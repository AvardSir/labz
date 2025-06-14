import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpButton } from "./SignUpButton";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import { EventTypeTag } from "./foundEvent/EventTypeTag";
import TelegramIcon from "./TelegramIcon";
import vkIcon from '../image/vk_ico.png';
import { Footer } from "./Footer";

export const FoundEvents = ({ events, fetchEvents, setFoundEvents }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);

  const handleShareClick = (platform, event) => {
    let url;
    if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(event.Name)}`;
    } else if (platform === 'vk') {
      url = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(event.Name)}`;
    }
    window.open(url, '_blank');
  };

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

  return <div className="found-events">
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


              <EventTypeTag type={event.ТипМероприятия} EventTypeId={event.EventTypeId} setFoundEvents={setFoundEvents} />
              <span>💰 {event.Стоимость} ₽</span>
              <span>🪑 {event.HowManyFreeSeats} мест</span>
              <span>📅 {new Date(event.Date).toLocaleDateString()}</span>

              <span>{event.Проведено === true ? '✅ Проведено' : '🕒 Запланировано'}</span>

              <span
                className="share-icon telegram"
                title="Поделиться в Telegram"
                onClick={() => handleShareClick("telegram", event)}
              >
                <TelegramIcon style={{ width: 16, height: 16, cursor: "pointer" }} />
              </span>

              <span
                className="share-icon vk"
                title="Поделиться в VK"
                onClick={() => handleShareClick("vk", event)}
              >
                <img src={vkIcon} alt="VK" width={16} height={16} style={{ cursor: "pointer" }} />
              </span>
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
    <Footer />
  </div>
};
