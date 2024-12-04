import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpButton } from "./SignUpButton";
import { AuthContext } from "./context/AuthContext";

export const FoundEvents = ({ events }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext); // Достаем loginData из контекста

  const handleSignUp = (eventId) => {
    // Здесь можно отправить запрос на сервер для записи пользователя
    // console.log(`Пользователь записался на мероприятие с ID: ${eventId}`);
    // alert("Вы успешно записались на мероприятие!");
  };

  return (
    <div className="found-events">
      {loginData.IdRights !== 1 && (
        <button onClick={() => navigate(`/add-event`)}>
          Добавить мероприятие
        </button>
      )}

      <h3>Найденные мероприятия</h3>
      {events.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index} className="event-item">
              <p><strong>Название:</strong> {event.Name}</p>
              <p><strong>Описание:</strong> {event.Description}</p>
              <p><strong>Дата:</strong> {new Date(event.Date).toLocaleDateString()}</p>
              <p><strong>Стоимость:</strong> {event.Стоимость} ₽</p>
              <p><strong>Количество свободных мест:</strong> {event.HowManyFreeSeats}</p>
              <p><strong>Проведено:</strong> {event.Проведено_Строка}</p>
              <p><strong>Тип мероприятия:</strong> {event.ТипМероприятия}</p>

              {/* Кнопка изменения мероприятия, если IdRights !== 1 */}
              {loginData.IdRights !== 1 && (
                <button
                  onClick={() => navigate(`/edit-event/${event.IdEvent}`)}
                  className="edit-button"
                >
                  Изменить
                </button>
              )}

              {/* Ссылка для перехода к комментариям события */}
              <button
                onClick={() => navigate(`/event-comments/${event.IdEvent}`)}
                className="comment-button"
              >
                Перейти к комментариям
              </button>

              {/* Кнопка записаться на мероприятие */}
              <SignUpButton eventId={event.IdEvent} onSignUp={handleSignUp} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
