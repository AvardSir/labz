import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import GetUserIdByLogin from "./GetUserIdByLogin"; // Импортируем компонент

export const SignUpButton = ({ eventId, onSignUp }) => {
  const { loginData } = useContext(AuthContext); // Получаем loginData из контекста
  const [userId, setUserId] = useState(null); // Состояние для хранения IdUser
  const [currentEventId, setCurrentEventId] = useState(eventId); // Состояние для eventId

  useEffect(() => {
    // Обновляем состояние при изменении eventId
    setCurrentEventId(eventId);
  }, [eventId]);

  const handleSignUp = () => {
    // console.log("UserId:", userId);
    // console.log("EventId:", currentEventId);

    // Проверяем, что userId получен
    if (!userId) {
      alert("Не удалось получить ID пользователя. Попробуйте снова.");
      return;
    }

    // Получение данных о мероприятии
    fetch(`/api/events`)
      .then((res) => res.json())
      .then((events) => {
        // Находим текущее мероприятие по его ID
        const event = events.find((e) => e.IdEvent === currentEventId);

        // Проверяем, есть ли свободные места
        if (event && event.HowManyFreeSeats > 0) {
          // Если есть места, отправляем запрос на запись
          fetch("/api/add-entry", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              IdEvent: currentEventId, // ID мероприятия
              IdUser: userId, // ID пользователя
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                alert(data.message); // Успешное сообщение
                if (onSignUp) onSignUp(event.IdEvent); // Если передана коллбек-функция
              }
            })
            .catch((error) => {
              console.error("Ошибка при записи:", error);
            });
        } else {
          // Если мест нет, уведомляем пользователя
          alert("Извините, свободных мест больше нет.");
        }
      })
      .catch((err) => {
        console.error("Ошибка получения информации о мероприятии:", err);
      });
  };

  // Функция для получения IdUser после его получения
  const onUserIdFetched = (fetchedId) => {
    setUserId(fetchedId); // Сохраняем IdUser
  };

  return (
    <div>
      {/* Используем компонент GetUserIdByLogin для получения IdUser */}
      <GetUserIdByLogin loginData={loginData} onUserIdFetched={onUserIdFetched} />

      <button onClick={handleSignUp} className="sign-up-button">
        Записаться на мероприятие
      </button>
    </div>
  );
};
