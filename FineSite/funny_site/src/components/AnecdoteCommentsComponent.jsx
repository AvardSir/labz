import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Путь к вашему контексту
import { useNavigate } from 'react-router-dom';

export const AnecdoteCommentsComponent = () => {
  const { anecdoteId } = useParams(); // Получаем ID анекдота из URL
  const { loginData } = useContext(AuthContext); // Извлекаем данные о пользователе из контекста
  const [anecdote, setAnecdote] = useState(null); // Состояние для анекдота
  const [comments, setComments] = useState([]); // Состояние для комментариев
  const [newComment, setNewComment] = useState(""); // Состояние для нового комментария
  const [userId, setUserId] = useState(null); // Состояние для ID пользователя
const navigate = useNavigate();
  useEffect(() => {
    // Запрос на получение анекдота
    fetch(`/api/anecdotes`)
      .then((res) => res.json())
      .then((data) => {
        // Ищем анекдот с нужным ID
        const foundAnecdote = data.find((a) => a.IdAnecdote === parseInt(anecdoteId));
        setAnecdote(foundAnecdote); // Устанавливаем анекдот
      })
      .catch((err) => console.error("Ошибка загрузки анекдота:", err));

    // Получение комментариев для текущего анекдота
    fetch(`/api/comments-anecdote?anecdoteId=${anecdoteId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Ошибка загрузки комментариев:", err));

    // Запрос на получение ID пользователя по имени из контекста
    if (loginData && loginData.login) {

      fetch(`/api/IdByUsername?Name=${encodeURIComponent(loginData.login)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Ошибка сети или сервер вернул ошибку');
        }
        return res.json();
    })
    .then((data) => {
        if (data && data.IdUser) {
          
            setUserId(data.IdUser); // Сохраняем IdUser
        } else {
            console.error("Не удалось получить IdUser.");
        }
    })
    .catch((err) => console.error("Ошибка при получении IdUser:", err));
    
    }
    
  }, [anecdoteId, loginData]);

  const handleAddComment = () => {
    if (!newComment) {
      return alert("Комментарий не может быть пустым.");
    }

    // Проверяем, есть ли данные о пользователе в контексте
    if (!loginData || !loginData.login || !userId) {
      return alert("Пожалуйста, войдите в систему, чтобы добавить комментарий.");
    }
    
    fetch(`/api/add-comment-anecdote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Text: newComment,
        IdUser: userId, // Используем реальный Id пользователя
        IdAnecdote: anecdoteId,
        
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Комментарий успешно добавлен") {
          // После успешного добавления комментария, обновляем список
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
    <div className="anecdote-comments-page">
      {anecdote ? (
        
        <div className="card">
          <div className="card-content">
                      
                <p >
                  {anecdote.Text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < anecdote.Text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
          
                      </div>
                      
                      <div className="card-meta">
                        <span>🏷️ {anecdote.AnecdoteType.trim()}</span>
                        <span>📅 {new Date(anecdote.Date).toLocaleDateString()}</span>
                        {/* <span>⭐ {anecdote.Rate}</span> */}
                        <span>👤 {anecdote.UserName}</span>
                      </div>
        </div>
      ) : (
        <p>Загрузка анекдота...</p>
      )}
      

      <h4>Комментарии:</h4>
      <ul className="comments-list">
  {comments.length > 0 ? (
    comments.map((comment, index) => (
      <li key={index} className="comment-item">
        {/* Основной текст комментария */}
        <div className="comment-bubble">
          <p className="comment-text">{comment.Text}</p>
        </div>
        
        {/* Мета-информация о комментарии */}
        <div className="comment-meta">
          {/* Аватар и имя автора */}
          <div className="comment-author">
            
            <strong className="author-name">{comment.AuthorName}</strong>
          </div>
          
          {/* Дата и время */}
          <time 
            dateTime={new Date(comment.Date).toISOString()}
            className="comment-date"
          >
            {new Date(comment.Date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </time>
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
      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Добавить комментарий"
        />
        <button onClick={handleAddComment}>Добавить</button>
        
        <button onClick={() => navigate('/')}>Назад</button>
      </div>
    </div>
  );
};
