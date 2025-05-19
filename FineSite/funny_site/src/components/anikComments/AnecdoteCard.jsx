import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export const AnecdoteCard = ({ anecdote, setAnecdote }) => {
  const { loginData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!anecdote) return <p>Загрузка анекдота...</p>;

  const canRate = loginData && (parseInt(loginData.IdRights) === 1 || parseInt(loginData.IdRights) === 2);

  const handleRate = async (isPlus) => {
    if (!canRate || loading) return;

    setLoading(true);
    try {
      const isSame = anecdote.UserRating === isPlus;

      const res = await fetch("/api/anecdotes/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          IdUser: loginData.IdUser,
          IdAnecdote: anecdote.IdAnecdote,
          IsPlus: isPlus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAnecdote({
          ...anecdote,
          Rate: data.newRating,
          UserRating: isSame ? null : isPlus,
        });
      }
    } catch (err) {
      console.error("Ошибка при оценке анекдота:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <p>
          {anecdote.Text?.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < anecdote.Text.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className="card-meta">
        <span>🏷️ {anecdote.AnecdoteType?.trim() || "Без категории"}</span>
        <span>⭐ {anecdote.Rate ?? 0}</span>
        <span>👤 {anecdote.UserName || "Неизвестный"}</span>
        <span>📅 {anecdote.Date ? new Date(anecdote.Date).toLocaleDateString() : "Дата неизвестна"}</span>
      </div>

      {canRate && (
        <div className="rating-buttons">
          <button
            onClick={() => handleRate(true)}
            disabled={loading}
            className={`rate-btn plus-btn ${anecdote.UserRating === true ? "active" : ""}`}
          >
            +
          </button>
          <button
            onClick={() => handleRate(false)}
            disabled={loading}
            className={`rate-btn minus-btn ${anecdote.UserRating === false ? "active" : ""}`}
          >
            –
          </button>
        </div>
      )}
      
    </div>
  );
};
