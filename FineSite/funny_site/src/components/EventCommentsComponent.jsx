import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Путь к вашему контексту

export const EventCommentsComponent = () => {
  const { eventId } = useParams(); // Получаем ID события из URL
  const { loginData } = useContext(AuthContext); // Извлекаем данные о пользователе из контекста
  const [event, setEvent] = useState(null); // Состояние для события
  const [comments, setComments] = useState([]); // Состояние для комментариев
  const [newComment, setNewComment] = useState(""); // Состояние для нового комментария
  const [userId, setUserId] = useState(null); // Состояние для ID пользователя

  useEffect(() => {
    console.log('s')
    // Запрос на получение события
    fetch(`/api/events/${eventId}`)  // Вы можете изменить URL в зависимости от вашего API
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("Ошибка загрузки события:", err));

    // Получение комментариев для текущего события
    fetch(`/api/get-comments-for-event/${eventId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Ошибка загрузки комментариев:", err));

    // Запрос на получение ID пользователя по имени из контекста
    if (loginData && loginData.login) {
      fetch(`/api/IdByUsername?Name=${encodeURIComponent(loginData.login)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.IdUser) {
            setUserId(data.IdUser); // Сохраняем IdUser
          } else {
            console.error("Не удалось получить IdUser.");
          }
        })
        .catch((err) => console.error("Ошибка при получении IdUser:", err));
    }
  }, [eventId, loginData]);

  const handleAddComment = () => {
    if (!newComment) {
      return alert("Комментарий не может быть пустым.");
    }

    // Проверяем, есть ли данные о пользователе в контексте
    if (!loginData || !loginData.login || !userId) {
      return alert("Пожалуйста, войдите в систему, чтобы добавить комментарий.");
    }

    // Добавление нового комментария
    fetch(`/api/add-comment-for-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Text: newComment,
        IdUser: userId,
        IdEvent: eventId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Комментарий успешно добавлен") {
          setComments([
            ...comments,
            {
              Text: newComment,
              Date: new Date().toISOString(),
              AuthorName: loginData.login, // Используем имя пользователя из контекста
            },
          ]);
          setNewComment(""); // Очищаем поле ввода
        } else {
          console.error("Ошибка при добавлении комментария:", data.error);
        }
      })
      .catch((err) => console.error("Ошибка добавления комментария:", err));
  };

  return (
    <div className="event-comments-page">
      {event ? (
        <div>
          <h3>Мероприятие #{event.IdEvent}</h3>
          <p>{event.Description}</p>
          <p><strong>{event.Name}</strong> ({new Date(event.Date).toLocaleDateString()})</p>
          <p><strong>Стоимость:</strong> {event.Стоимость}</p>
        </div>
      ) : (
        <p>Загрузка мероприятия...</p>
      )}

      <h4>Комментарии:</h4>
      <ul>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <li key={index}>
              <p>{comment.Text}</p>
              <p><strong>{comment.AuthorName}</strong> ({new Date(comment.Date).toLocaleDateString()})</p>
            </li>
          ))
        ) : (
          <p>Комментариев нет</p>
        )}
      </ul>
      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Добавить комментарий"
        />
        <button onClick={handleAddComment}>Добавить</button>
      </div>
    </div>
  );
};
