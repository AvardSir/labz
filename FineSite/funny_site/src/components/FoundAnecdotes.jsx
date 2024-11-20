import React from "react";
import { useNavigate } from "react-router-dom";

export const FoundAnecdotes = ({ anecdotes }) => {
  const navigate = useNavigate();

  return (
    <div className="found-anecdotes">
      <h3>Найденные анекдоты</h3>
      {anecdotes.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <ul>
          {anecdotes.map((anecdote) => (
            <li key={anecdote.IdAnecdote} className="anecdote-item">
              <p><strong>Текст:</strong> {anecdote.Text}</p>
              <p><strong>Дата:</strong> {new Date(anecdote.Date).toLocaleDateString()}</p>
              <p><strong>Рейтинг:</strong> {anecdote.Rate}</p>
              <p><strong>Автор:</strong> {anecdote.UserName}</p>
              <p><strong>Тип:</strong> {anecdote.AnecdoteType.trim()}</p>
              <button onClick={() => navigate(`/anecdote-comments/${anecdote.IdAnecdote}`)}>
                Перейти к комментариям
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
