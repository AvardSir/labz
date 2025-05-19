import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  AnecdoteCard, 
  CommentList, 
  CommentForm 
} from ".";

export const AnecdoteCommentsComponent = () => {
  const { anecdoteId } = useParams();
  const { loginData } = useContext(AuthContext);
  const [anecdote, setAnecdote] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Запрос на получение анекдота
    fetch(`/api/anecdotes`)
      .then((res) => res.json())
      .then((data) => {
        const foundAnecdote = data.find((a) => a.IdAnecdote === parseInt(anecdoteId));
        setAnecdote(foundAnecdote);
      })
      .catch((err) => console.error("Ошибка загрузки анекдота:", err));

    // Получение комментариев
    fetch(`/api/comments-anecdote?anecdoteId=${anecdoteId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Ошибка загрузки комментариев:", err));

    // Запрос на получение ID пользователя
     
  }, [anecdoteId, loginData]);

  const handleAddComment = () => {
    if (!newComment) return alert("Комментарий не может быть пустым.");
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
        IdUser: userId,
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
  };

  return (
    <div className="anecdote-comments-page">
      <AnecdoteCard anecdote={anecdote} setAnecdote={setAnecdote} />

      
      <h4>Комментарии:</h4>
      <CommentList comments={comments} />
      
      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
      />
    </div>
  );
};