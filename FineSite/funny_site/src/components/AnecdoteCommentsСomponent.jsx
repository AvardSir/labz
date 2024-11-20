import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const AnecdoteCommentsСomponent = () => {
  const { anecdoteId } = useParams(); // Получаем ID анекдота из URL
  const [anecdote, setAnecdote] = useState(null); // Состояние для анекдота
  const [comments, setComments] = useState([]); // Состояние для комментариев
  const [newComment, setNewComment] = useState(""); // Состояние для нового комментария

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
  }, [anecdoteId]);

  const handleAddComment = () => {
    if (!newComment) {
      return alert("Комментарий не может быть пустым.");
    }

    // Добавление нового комментария
    fetch(`/api/add-comment-anecdote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Text: newComment,
        IdAnecdote: anecdoteId,
        IdUser: 123, // Пример ID пользователя. Его нужно заменить на актуальный.
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
        <div>
          <h3>Анекдот #{anecdote.IdAnecdote}</h3>
          
          <p>{anecdote.Text}</p>
          <p><strong>{anecdote.UserName}</strong> ({new Date(anecdote.Date).toLocaleDateString()})</p>
          <p><strong>Тип:</strong> {anecdote.AnecdoteType}</p>
          <p><strong>Оценка:</strong> {anecdote.Rate}</p>
        </div>
      ) : (
        <p>Загрузка анекдота...</p>
      )}

      <h4>Комментарии:</h4>
      <ul>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <li key={index}>
              <p>{comment.Text}</p>
              <small>{new Date(comment.Date).toLocaleDateString()}</small>
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
