import React from "react";
import { AnecdoteTypeTag } from "../foundAnekdot/AnecdoteTypeTag";
import AnecdoteAudioButton from "../AnecdoteAudioButton";
import FavoriteButton from "../FavoriteButton";
import { RatingButtons } from "../RatingButtons";
import ShareButtons from "./ShareButtons";

import axios from "axios";

const AnecdoteCard = ({ anecdote, loginData, navigate, setFoundAnecdotes }) => {
  const handleDelete = async (idAnecdote) => {
    try {
      const res = await axios.delete("/api/delete_anecdote", { data: { idAnecdote } });
      alert(res.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении анекдота:", error);
      alert("Произошла ошибка при удалении анекдота");
    }
  };

  const showRatingButtons = () => {
    const rights = Number.parseInt(loginData.IdRights);
    return rights === 1 || rights === 2;
  };

  return (
    <li className="card">
      <div
        className="card-content cursor-pointer hover:bg-gray-100 p-2 rounded transition"
        title="Нажмите, чтобы скопировать"
        onClick={() => {
          navigator.clipboard.writeText(anecdote.Text)
            .then(() => alert("Текст скопирован"))
            .catch(console.error);
        }}
      >
        <p>{anecdote.Text.split("\n").map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}</p>
      </div>

      <div className="card-meta">
        {showRatingButtons() && (
          <RatingButtons
            anecdoteId={anecdote.IdAnecdote}
            initialRating={anecdote.Rate}
            initialUserRating={anecdote.UserRating}
          />
        )}

        <AnecdoteTypeTag
          type={anecdote.AnecdoteType}
          typeId={anecdote.IdTypeAnecdote}
          setFoundAnecdotes={setFoundAnecdotes}
        />

        <span>👤 {anecdote.UserName}</span>
        <span>📅 {new Date(anecdote.Date).toLocaleDateString()}</span>

        <ShareButtons anecdote={anecdote} />
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate(`/anecdote-comments/${anecdote.IdAnecdote}`)}>💬 Комментарии</button>
        <AnecdoteAudioButton idAnecdote={anecdote.IdAnecdote} />

        {(Number(loginData.IdRights) === 2 || Number(loginData.IdRights) === 1) && (
          <FavoriteButton userId={loginData.IdUser} anecdoteId={anecdote.IdAnecdote} />
        )}

        {Number(loginData.IdRights) === 2 && (
          <>
            <button onClick={() => navigate(`/edit-anecdote/${anecdote.IdAnecdote}`)} className="action-btn edit-btn">
              ✏️ Изменить
            </button>
            <button onClick={() => handleDelete(anecdote.IdAnecdote)} className="action-btn delete-btn">
              🗑️ Удалить
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default AnecdoteCard;
