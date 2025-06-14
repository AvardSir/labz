import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

import { AnecdoteTypeTag } from "../foundAnekdot/AnecdoteTypeTag";
import AnecdoteAudioButton from "../AnecdoteAudioButton";
import FavoriteButton from "../FavoriteButton";
import { RatingButtons } from "../RatingButtons";
import { Footer } from "../Footer";
import AnecdoteCard from "./AnecdoteCard";

export const FoundAnecdotes = ({ anecdotes, setFoundAnecdotes, fetchAnecdotes }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);
  const [localAnecdotes, setLocalAnecdotes] = useState([]);

  useEffect(() => {
    const fetchRatedAnecdotes = async () => {
      try {
        const res = await fetch(`/api/rated-anecdotes?IdUser=${loginData.IdUser}`);
        const rated = await res.json();
        const ratedMap = new Map(rated.map((r) => [r.IdAnecdote, r.IsPlus]));
        const updatedAnecdotes = anecdotes.map((a) => ({
          ...a,
          UserRating: ratedMap.get(a.IdAnecdote) ?? null,
        }));
        setLocalAnecdotes(updatedAnecdotes);
      } catch (error) {
        console.error("Ошибка при загрузке рейтингов:", error);
        setLocalAnecdotes(anecdotes);
      }
    };

    if (loginData?.IdUser && anecdotes.length > 0) fetchRatedAnecdotes();
    else setLocalAnecdotes(anecdotes);
  }, [anecdotes, loginData]);

  return (
    <div className="found-anecdotes">
      <button onClick={fetchAnecdotes} className="action-btn">Сбросить поиск по типам</button>

      {Number(loginData.IdRights) === 2 && (
        <button onClick={() => navigate("/add-anecdote")} className="action-btn add-btn">
          ✚ Добавить анекдот
        </button>
      )}

      {loginData?.IdUser && (
        <button onClick={() => navigate("/suggest-anecdote")} className="action-btn suggest-btn">
          💡 Предложить анекдот
        </button>
      )}

      <h3 className="section-title">Найденные анекдоты (💡 Нажмите на анекдот, чтобы скопировать его текст)</h3>

      {localAnecdotes.length === 0 ? (
        <p className="empty-message">Ничего не найдено</p>
      ) : (
        <ul className="anecdotes-list">
          {localAnecdotes.map((anecdote) => (
            <AnecdoteCard
              key={anecdote.IdAnecdote}
              anecdote={anecdote}
              loginData={loginData}
              navigate={navigate}
              setFoundAnecdotes={setFoundAnecdotes}
            />
          ))}
        </ul>
      )}
      <Footer />
    </div>
  );
};
