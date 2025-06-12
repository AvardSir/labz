import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AnecdoteCard, CommentList, CommentForm } from ".";
import { useNavigate } from 'react-router-dom';

export const AnecdoteCommentsComponent = () => {
  const { anecdoteId } = useParams();
  const { loginData } = useContext(AuthContext);
  const [anecdote, setAnecdote] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAnecdoteData = async () => {
      try {
        // Получаем список всех анекдотов (или замени на /api/anecdote/:id если есть)
        const anecdoteRes = await fetch(`/api/anecdotes`);
        const anecdotesData = await anecdoteRes.json();
        const foundAnecdote = anecdotesData.find((a) => a.IdAnecdote === parseInt(anecdoteId));

        if (!foundAnecdote) {
          console.error("Анекдот не найден");
          return;
        }

        // Если пользователь вошел, получаем его оценку
        if (loginData?.IdUser) {
          const ratingRes = await fetch(`/api/rating?IdUser=${loginData.IdUser}&IdAnecdote=${anecdoteId}`);
          const ratingData = await ratingRes.json();

          if (ratingData.length > 0 && typeof ratingData[0].IsPlus !== "undefined") {
            foundAnecdote.UserRating = ratingData[0].IsPlus; // true / false
          } else {
            foundAnecdote.UserRating = null;
          }
        }

        setAnecdote(foundAnecdote);
      } catch (err) {
        console.error("Ошибка загрузки анекдота или рейтинга:", err);
      }
    };

    fetchAnecdoteData();

    fetch(`/api/comments-anecdote?anecdoteId=${anecdoteId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Ошибка загрузки комментариев:", err));
  }, [anecdoteId, loginData]);

  const handleAddComment = () => {
    if (!newComment.trim()) return alert("Комментарий не может быть пустым.");
    if (!loginData?.login || !loginData?.IdUser) {
      return alert("Пожалуйста, войдите в систему, чтобы добавить комментарий.");
    }

    fetch(`/api/add-comment-anecdote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Text: newComment,
        IdUser: loginData.IdUser,
        IdAnecdote: anecdoteId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Комментарий успешно добавлен") {
          setComments([
            ...comments,
            {
              Text: newComment,
              Date: new Date().toISOString(),
              AuthorName: loginData.login,
            },
          ]);
          setNewComment("");
        }
      })
      .catch((err) => console.error("Ошибка добавления комментария:", err));

      window.location.reload()
  };

  return (
    <div className="anecdote-comments-page">
      <AnecdoteCard anecdote={anecdote} setAnecdote={setAnecdote} />
      <button onClick={() => navigate('/')} className="back-button">Назад</button>
      <h4>Комментарии:</h4>


      <CommentList comments={comments} IdCommentsontheAnecdote={comments.IdCommentsontheAnecdote} />


      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
      />
    </div>
  );
};
