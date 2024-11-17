import React from "react";

export const FoundAnecdotes = ({ anecdotes }) => {
  return (
    <div className="found-anecdotes">
      <h3>Найденные анекдоты</h3>
      {anecdotes.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <ul>
          {anecdotes.map((anecdote, index) => (
            <li key={index} className="anecdote-item">
              <p><strong>Текст:</strong> {anecdote.Text}</p>
              <p><strong>Дата:</strong> {new Date(anecdote.Date).toLocaleDateString()}</p>
              <p><strong>Рейтинг:</strong> {anecdote.Rate}</p>
              <p><strong>Автор:</strong> {anecdote.UserName}</p>
              <p><strong>Тип:</strong> {anecdote.AnecdoteType.trim()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
