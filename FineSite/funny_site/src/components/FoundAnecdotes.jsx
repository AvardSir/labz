import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";

export const FoundAnecdotes = ({ anecdotes }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);
  const [localAnecdotes, setLocalAnecdotes] = useState([]);
  

  useEffect(() => {
    const fetchRatedAnecdotes = async () => {
      try {
        const res = await fetch(`/api/rated-anecdotes?IdUser=${loginData.IdUser}`);
        const rated = await res.json(); // Массив объектов: { IdAnecdote, IsPlus }

        const ratedMap = new Map(
          rated.map((r) => [r.IdAnecdote, r.IsPlus])
        );

        const updatedAnecdotes = anecdotes.map((a) => ({
          ...a,
          UserRating: ratedMap.has(a.IdAnecdote) ? ratedMap.get(a.IdAnecdote) : null,
        }));

        setLocalAnecdotes(updatedAnecdotes);
      } catch (error) {
        console.error("Ошибка при загрузке рейтингов:", error);
        setLocalAnecdotes(anecdotes); // хотя бы покажем анекдоты
      }
    };

    if (loginData?.IdUser && anecdotes.length > 0) {
      fetchRatedAnecdotes();
    } else {
      setLocalAnecdotes(anecdotes);
    }
  }, [anecdotes, loginData]);

  const handleRate = async (idAnecdote, isPlus) => {
    try {
      const current = localAnecdotes.find((a) => a.IdAnecdote === idAnecdote);
      const isSameRating = current.UserRating === isPlus;

      const res = await fetch("/api/anecdotes/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          IdUser: loginData.IdUser,
          IdAnecdote: idAnecdote,
          IsPlus: isPlus,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const updated = localAnecdotes.map((a) =>
          a.IdAnecdote === idAnecdote
            ? {
              ...a,
              Rate: data.newRating,
              UserRating: isSameRating ? null : isPlus,
            }
            : a
        );
        setLocalAnecdotes(updated);
      }
    } catch (error) {
      console.error("Ошибка при оценке:", error);
    }
  };

  const handleDelete = async (idAnecdote) => {
    try {
      const res = await axios.delete("/api/delete_anecdote", {
        data: { idAnecdote },
      });
      alert(res.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении анекдота:", error);
      alert("Произошла ошибка при удалении анекдота");
    }
  };

  const showRatingButtons = () => {
    const rights = parseInt(loginData.IdRights);
    return rights === 1 || rights === 2;
  };

  return (
    <div className="found-anecdotes">
      {parseInt(loginData.IdRights) === 2 && (
        <button onClick={() => navigate("/add-anecdote")} className="action-btn add-btn">
          ✚ Добавить анекдот
        </button>
      )}

      <h3 className="section-title">Найденные анекдоты</h3>

      {localAnecdotes.length === 0 ? (
        <p className="empty-message">Ничего не найдено</p>
      ) : (
        <ul className="anecdotes-list">
          {localAnecdotes.map((anecdote) => (
            <li key={anecdote.IdAnecdote} className="card">
              <div className="card-content">
                <p>
                  {anecdote.Text.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < anecdote.Text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div className="card-meta">
                <span>🏷️ {anecdote.AnecdoteType.trim()}</span>
                <span>⭐ {anecdote.Rate || 0}</span>
                <span>👤 {anecdote.UserName}</span>
                <span>📅 {new Date(anecdote.Date).toLocaleDateString()}</span>
              </div>

              {showRatingButtons() && (
                <div className="rating-buttons">
                  <button
                    onClick={() => handleRate(anecdote.IdAnecdote, true)}
                    className={`rate-btn plus-btn ${anecdote.UserRating === true ? 'active' : ''}`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRate(anecdote.IdAnecdote, false)}
                    className={`rate-btn minus-btn ${anecdote.UserRating === false ? 'active' : ''}`}
                  >
                    –
                  </button>
                </div>
              )}

              <div className="action-buttons">
                <button onClick={() => navigate(`/anecdote-comments/${anecdote.IdAnecdote}`)}>
                  💬 Комментарии
                </button>

                {parseInt(loginData.IdRights) === 2 && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-anecdote/${anecdote.IdAnecdote}`)}
                      className="action-btn edit-btn"
                    >
                      ✏️ Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(anecdote.IdAnecdote)}
                      className="action-btn delete-btn"
                    >
                      🗑️ Удалить
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
