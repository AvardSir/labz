import React from "react";
import { Link } from "react-router-dom";

export const FoundEvents = ({ events }) => {
  return (
    <div className="found-events">
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
              
              {/* Ссылка для перехода к комментариям события */}
              <Link to={`/event-comments/${event.IdEvent}`} className="comment-link">
                Перейти к комментариям
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
