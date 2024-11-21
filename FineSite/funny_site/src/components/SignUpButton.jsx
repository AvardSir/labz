import React, { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import GetUserIdByLogin from "./GetUserIdByLogin";  // Импортируем компонент

export const SignUpButton = ({ eventId, onSignUp }) => {
  const { loginData } = useContext(AuthContext); // Получаем loginData из контекста
  const [userId, setUserId] = useState(null); // Состояние для хранения IdUser

  const handleSignUp = () => {
    if (userId) {
      fetch('/api/add-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IdEvent: eventId,  // ID мероприятия
          IdUser: userId,    // ID пользователя, полученный через GetUserIdByLogin
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);  // Выводим сообщение об успешной записи
          }
        })
        .catch((error) => {
          console.error("Ошибка при записи:", error);
        });
    } else {
      alert("Не удалось получить ID пользователя.");
    }
  };

  // Функция для получения IdUser после его получения
  const onUserIdFetched = (fetchedId) => {
    setUserId(fetchedId);  // Сохраняем IdUser
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
