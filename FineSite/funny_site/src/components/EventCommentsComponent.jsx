import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Путь к вашему контексту
import { useNavigate } from 'react-router-dom';

export const EventCommentsComponent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); // Получаем ID события из URL
  const { loginData } = useContext(AuthContext); // Извлекаем данные о пользователе из контекста
  const [event, setEvent] = useState(null); // Состояние для события
  const [comments, setComments] = useState([]); // Состояние для комментариев
  const [newComment, setNewComment] = useState(""); // Состояние для нового комментария
  const [userId, setUserId] = useState(null); // Состояние для ID пользователя

  useEffect(() => {
    
    // Запрос на получение события
    fetch(`/event-details/${eventId}`)  // URL с использованием параметра eventId
  .then((res) => {
    if (!res.ok) {
      throw new Error('Ошибка сети');
    }
    return res.json();
  })
  .then((data) => setEvent(data[0]))
  .catch((err) => console.error('Ошибка загрузки события:', err));

    // Получение комментариев для текущего события
    fetch(`/api/get-comments-for-event?eventId=${eventId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Ошибка загрузки комментариев:", err));

    // Запрос на получение ID пользователя по имени из контекста
    console.log(loginData.login)
    
    if (loginData && loginData.login) {
      fetch(`/api/IdByUsername_forEvents?Name=${encodeURIComponent(loginData.login)}`)
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
    fetch(`/api/add-comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newComment, // Соответствует параметру `@Text`
        idUser: userId,   // Соответствует параметру `@IdUser`
        idEvent: eventId, // Соответствует параметру `@IdEvent`
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Комментарий успешно добавлен.") {
          // Добавляем новый комментарий в список
          setComments([
            ...comments,
            {
              CommentText: newComment, // Совпадает с отображением на UI
              CommentDate: new Date().toISOString(), // Добавляем текущую дату
              AuthorName: loginData.login,    // Имя пользователя из контекста
            },
          ]);
          setNewComment(""); // Очищаем поле ввода
        } else {
          console.error("Ошибка при добавлении комментария:", data.error);
        }
      })
      .catch((err) => {
        console.error("Ошибка добавления комментария:", err);
      });
    
  };

  return (
    <div className="event-comments-page">
      {event ? (
        <div className="card">
          <h4 className="card-title">{event.Name}</h4>
          <div className="card-content">
            <p>{event.Description}</p>
          </div>
        
          <div className="card-meta">
            <span>💰 {event.Стоимость} ₽</span>
            <span>📅 {new Date(event.Date).toLocaleDateString()}</span>
            <span>🪑 {event.HowManyFreeSeats} мест</span>
            <span>🏷️ {event.ТипМероприятия}</span>
            
            <span>{event.Проведено === true ? '✅ Проведено' : '🕒 Запланировано'}</span>
          </div>
        
        </div>
      ) : (
        <p>Загрузка мероприятия...</p>
      )}
<button onClick={() => navigate('/events')} class="back-button">Назад</button>
      <h4>Комментарии:</h4>
      <ul className="comments-list">
  {comments.length > 0 ? (
    comments.map((comment, index) => (
      <li key={index} className="comment-item">
        {/* Основной текст комментария */}
        <div className="comment-bubble">
          {console.log(comment)}
          <p className="comment-text">{comment.CommentText}</p>
        </div>
        
        {/* Мета-информация о комментарии */}
        <div className="comment-meta">
          {/* Аватар и имя автора */}
          <div className="comment-author">
            
            <strong className="author-name">{comment.AuthorName}</strong>
          </div>
          
          {/* Дата и время */}
          
        </div>
      </li>
    ))
  ) : (
    <div className="no-comments">
      <i className="icon-comment"></i>
      <p>Пока нет комментариев</p>
    </div>
  )}
</ul>
      <div class="comment-container">
    <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Добавить комментарий"
        class="comment-input"
    />
    <button onClick={handleAddComment} class="comment-button">Добавить</button>
    <button onClick={() => navigate('/events')} class="back-button">Назад</button>
</div>
    </div>
  );
};
