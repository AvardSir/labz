import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const BATCH_SIZE = 10;

export const EventCommentsComponent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { loginData } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch(`/event-details/${eventId}`)
      .then((res) => res.ok ? res.json() : Promise.reject("Ошибка сети"))
      .then((data) => setEvent(data[0]))
      .catch((err) => console.error("Ошибка загрузки события:", err));

    fetch(`/api/get-comments-for-event?eventId=${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setVisibleCount(BATCH_SIZE);
      })
      .catch((err) => console.error("Ошибка загрузки комментариев:", err));

    if (loginData?.login) {
      fetch(`/api/IdByUsername_forEvents?Name=${encodeURIComponent(loginData.login)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.IdUser) setUserId(data.IdUser);
          else console.error("Не удалось получить IdUser.");
        })
        .catch((err) => console.error("Ошибка при получении IdUser:", err));
    }
  }, [eventId, loginData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 200) {
        setVisibleCount(prev => Math.min(prev + BATCH_SIZE, comments.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [comments]);

  const handleAddComment = () => {
    if (!newComment) return alert("Комментарий не может быть пустым.");
    if (!loginData?.login || !userId) return alert("Войдите, чтобы комментировать.");

    fetch(`/api/add-comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newComment,
        idUser: userId,
        idEvent: eventId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Комментарий успешно добавлен.") {
          const newCom = {
            IdCommentsEvents: data.insertedId || Date.now(),
            CommentText: newComment,
            CommentDate: new Date().toISOString(),
            AuthorName: loginData.login,
            IdUser: userId,
          };
          setComments(prev => [...prev, newCom]);
          setNewComment("");
        } else {
          console.error("Ошибка добавления:", data.error);
        }
      })
      .catch((err) => console.error("Ошибка добавления комментария:", err));
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Удалить этот комментарий?")) return;

    try {
      const res = await fetch(`/api/event-comment-delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ошибка удаления");
      setComments(prev => prev.filter(c => c.IdCommentsEvents !== id));
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить комментарий");
    }
  };

  const visibleComments = comments.slice(0, visibleCount);

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
            <span>{event.Проведено ? '✅ Проведено' : '🕒 Запланировано'}</span>
          </div>
        </div>
      ) : (
        <p>Загрузка мероприятия...</p>
      )}

      <button onClick={() => navigate('/events')} className="back-button">Назад</button>

      <h4>Комментарии:</h4>
      <ul className="comments-list">
        {visibleComments.length > 0 ? (
          visibleComments.map((comment) => (
            <li key={comment.IdCommentsEvents} className="comment-item">
              <div className="comment-bubble">
                <p className="comment-text">{comment.CommentText}</p>
              </div>
              <div className="comment-meta">
                <div className="comment-author">
                  <strong className="author-name">{comment.AuthorName}</strong>
                </div>
                <time className="comment-date">
                  {comment.CommentDate
                    ? new Date(comment.CommentDate).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </time>
                {loginData.IdRights === 2 && (
                  <button
                    className="delete-comment-button"
                    onClick={() => handleDeleteComment(comment.IdCommentsEvents)}
                  >
                    Удалить
                  </button>
                )}
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

      <div className="comment-container">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Добавить комментарий"
          className="comment-input"
        />
        <button onClick={handleAddComment} className="comment-button">Добавить</button>
        <button onClick={() => navigate('/events')} className="back-button">Назад</button>
      </div>
    </div>
  );
};
