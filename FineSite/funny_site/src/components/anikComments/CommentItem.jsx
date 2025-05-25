import React from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
export const CommentItem = ({ comment, onDelete }) => {
  const { loginData } = useContext(AuthContext);
  const handleDelete = async () => {
    if (!window.confirm("Удалить этот комментарий?")) return;
    try {
      await axios.delete(`/api/comment-delete/${comment.IdCommentsontheAnecdote}`);
      if (onDelete) {
        onDelete(comment.IdCommentsontheAnecdote);
      }
    } catch (error) {
      alert("Ошибка удаления комментария");
      console.error(error);
    }
  };

  return (
    <li className="comment-item">
      <div className="comment-bubble">
        <p className="comment-text">{comment.Text}</p>
      </div>
      <div className="comment-meta">
        <div className="comment-author">
          <strong className="author-name">{comment.AuthorName}</strong>
        </div>
        <time
          dateTime={new Date(comment.Date).toISOString()}
          className="comment-date"
        >
          {new Date(comment.Date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </time>
      </div>
      
      {loginData.IdRights == 2 && (
      <button onClick={handleDelete} style={{ marginTop: "5px" }}>
        Удалить
      </button>)}
    </li>
  );
};
