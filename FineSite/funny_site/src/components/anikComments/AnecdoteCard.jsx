import React from "react";

export const AnecdoteCard = ({ anecdote }) => {
  if (!anecdote) return <p>Загрузка анекдота...</p>;

  return (
    <div className="card">
      <div className="card-content">
        <p>
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
        <span>👤 {anecdote.UserName}</span>
      </div>
    </div>
  );
};